import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Account from '../models/Account.js'
import { generateToken } from '../utils/generateToken.js'
import { sendPhoneOtp, verifyPhoneOtp } from '../services/otpService.js'
import { env } from '../config/env.js'

function publicAccount(account) {
  return {
    id: account._id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    role: account.role,
  }
}

function normalizedCredentials(body) {
  return {
    name: body.name?.trim(),
    email: body.email?.trim().toLowerCase(),
    phone: body.phone?.trim(),
    password: body.password,
    otp: body.otp?.trim(),
  }
}

function isValidPhone(phone) {
  return /^\+[1-9]\d{7,14}$/.test(phone || '')
}

export function sendRegisterOtp(role) {
  return async (req, res, next) => {
    try {
      const { name, email, phone, password } = normalizedCredentials(req.body)
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Name, email, phone and password are required' })
      }
      if (!isValidPhone(phone)) {
        return res.status(400).json({ message: 'Use international phone format, for example +919876543210' })
      }
      if (password.length < 6 || bcrypt.truncates(password)) {
        return res.status(400).json({ message: 'Password must be between 6 and 72 bytes' })
      }

      const existingAccount = await Account.findOne({ email })
      if (existingAccount) {
        return res.status(409).json({ message: 'An account with this email already exists' })
      }

      await sendPhoneOtp(phone)
      res.json({ message: `OTP sent to ${phone.slice(0, 3)}******${phone.slice(-2)}` })
    } catch (error) {
      next(error)
    }
  }
}

export function verifyRegisterOtp(role) {
  return async (req, res, next) => {
    try {
      const { name, email, phone, password, otp } = normalizedCredentials(req.body)
      if (!name || !email || !phone || !password || !otp) {
        return res.status(400).json({ message: 'All registration details and OTP are required' })
      }

      const existingAccount = await Account.findOne({ email })
      if (existingAccount) {
        return res.status(409).json({ message: 'An account with this email already exists' })
      }

      if (!(await verifyPhoneOtp(phone, otp))) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const account = await Account.create({ name, email, phone, password: hashedPassword, role })
      res.status(201).json({
        message: `${role === 'admin' ? 'Admin' : 'User'} registered successfully`,
        account: publicAccount(account),
      })
    } catch (error) {
      next(error)
    }
  }
}

export function sendLoginOtp(role) {
  return async (req, res, next) => {
    try {
      const { email, password } = normalizedCredentials(req.body)
      const account = await Account.findOne({ email, role }).select('+password')
      if (!account || !(await bcrypt.compare(password || '', account.password))) {
        return res.status(401).json({ message: `Invalid ${role} email or password` })
      }
      if (!account.phone) {
        return res.status(400).json({ message: 'This account has no verified phone number. Please register an OTP-ready account.' })
      }

      await sendPhoneOtp(account.phone)
      res.json({ message: `OTP sent to ${account.phone.slice(0, 3)}******${account.phone.slice(-2)}` })
    } catch (error) {
      next(error)
    }
  }
}

export function verifyLoginOtp(role) {
  return async (req, res, next) => {
    try {
      const { email, password, otp } = normalizedCredentials(req.body)
      if (!otp) return res.status(400).json({ message: 'OTP is required' })

      const account = await Account.findOne({ email, role }).select('+password')
      if (!account || !(await bcrypt.compare(password || '', account.password))) {
        return res.status(401).json({ message: `Invalid ${role} email or password` })
      }
      if (!(await verifyPhoneOtp(account.phone, otp))) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
      }

      res.json({
        message: 'Login successful',
        token: generateToken(account),
        account: publicAccount(account),
      })
    } catch (error) {
      next(error)
    }
  }
}

export function sendForgotPasswordOtp(role) {
  return async (req, res, next) => {
    try {
      const email = req.body.email?.trim().toLowerCase()
      const account = await Account.findOne({ email, role })
      if (!account?.phone) return res.status(404).json({ message: 'OTP-ready account not found' })
      await sendPhoneOtp(account.phone)
      res.json({ message: 'Password reset OTP sent to registered phone' })
    } catch (error) {
      next(error)
    }
  }
}

export function resetPasswordWithOtp(role) {
  return async (req, res, next) => {
    try {
      const email = req.body.email?.trim().toLowerCase()
      const otp = req.body.otp?.trim()
      const newPassword = req.body.newPassword
      if (!otp || !newPassword || newPassword.length < 6 || bcrypt.truncates(newPassword)) {
        return res.status(400).json({ message: 'Valid OTP and password of 6–72 bytes are required' })
      }
      const account = await Account.findOne({ email, role }).select('+password')
      if (!account?.phone) return res.status(404).json({ message: 'Account not found' })
      if (!(await verifyPhoneOtp(account.phone, otp))) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
      }
      account.password = await bcrypt.hash(newPassword, 12)
      await account.save()
      res.json({ message: 'Password reset successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export async function sendPhoneChangeOtp(req, res, next) {
  try {
    const phone = req.body.phone?.trim()
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: 'Use international phone format, for example +919876543210' })
    }
    await sendPhoneOtp(phone)
    res.json({ message: 'OTP sent to new phone number' })
  } catch (error) {
    next(error)
  }
}

export async function confirmPhoneChange(req, res, next) {
  try {
    const phone = req.body.phone?.trim()
    const otp = req.body.otp?.trim()
    if (!(await verifyPhoneOtp(phone, otp))) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }
    req.account.phone = phone
    await req.account.save()
    res.json({ message: 'Phone number updated successfully', account: publicAccount(req.account) })
  } catch (error) {
    next(error)
  }
}

export async function sendSensitiveActionOtp(req, res, next) {
  try {
    await sendPhoneOtp(req.account.phone)
    res.json({ message: 'Admin action OTP sent' })
  } catch (error) {
    next(error)
  }
}

export async function verifySensitiveActionOtp(req, res, next) {
  try {
    if (!(await verifyPhoneOtp(req.account.phone, req.body.otp?.trim()))) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }
    const actionToken = jwt.sign(
      { accountId: req.account._id.toString(), role: 'admin', purpose: 'sensitive-action' },
      env.jwtSecret,
      { expiresIn: '5m' },
    )
    res.json({ message: 'Admin action verified', actionToken })
  } catch (error) {
    next(error)
  }
}

export function register(role) {
  return async (req, res, next) => {
    try {
      const name = req.body.name?.trim()
      const email = req.body.email?.trim().toLowerCase()
      const password = req.body.password

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' })
      }
      if (password.length < 6 || bcrypt.truncates(password)) {
        return res.status(400).json({ message: 'Password must be between 6 and 72 bytes' })
      }

      const existingAccount = await Account.findOne({ email })
      if (existingAccount) {
        return res.status(409).json({ message: 'An account with this email already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const account = await Account.create({ name, email, password: hashedPassword, role })

      res.status(201).json({
        message: `${role === 'admin' ? 'Admin' : 'User'} registered successfully`,
        account: publicAccount(account),
      })
    } catch (error) {
      next(error)
    }
  }
}

export function login(role) {
  return async (req, res, next) => {
    try {
      const email = req.body.email?.trim().toLowerCase()
      const password = req.body.password

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      const account = await Account.findOne({ email, role }).select('+password')
      if (!account || !(await bcrypt.compare(password, account.password))) {
        return res.status(401).json({ message: `Invalid ${role} email or password` })
      }

      res.json({
        message: 'Login successful',
        token: generateToken(account),
        account: publicAccount(account),
      })
    } catch (error) {
      next(error)
    }
  }
}

export function getCurrentAccount(req, res) {
  res.json({ account: publicAccount(req.account) })
}

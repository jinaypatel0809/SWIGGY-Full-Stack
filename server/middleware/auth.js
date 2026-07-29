import jwt from 'jsonwebtoken'
import Account from '../models/Account.js'
import { env } from '../config/env.js'

export async function protect(req, res, next) {
  try {
    const authorization = req.headers.authorization
    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authorization.slice(7)
    const payload = jwt.verify(token, env.jwtSecret)
    const account = await Account.findById(payload.accountId)

    if (!account) {
      return res.status(401).json({ message: 'Account no longer exists' })
    }

    req.account = account
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired session' })
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.account.role !== role) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' })
    }
    next()
  }
}

export function requireSensitiveAction(req, res, next) {
  try {
    const token = req.headers['x-action-token']
    const payload = jwt.verify(token, env.jwtSecret)
    if (
      payload.purpose !== 'sensitive-action'
      || payload.role !== 'admin'
      || payload.accountId !== req.account._id.toString()
    ) {
      return res.status(403).json({ message: 'Sensitive action verification required' })
    }
    next()
  } catch {
    res.status(403).json({ message: 'Admin OTP verification required or expired' })
  }
}

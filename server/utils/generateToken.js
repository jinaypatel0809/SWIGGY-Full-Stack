import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function generateToken(account) {
  return jwt.sign(
    { accountId: account._id.toString(), role: account.role },
    env.jwtSecret,
    { expiresIn: '7d' },
  )
}

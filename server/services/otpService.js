import twilio from 'twilio'
import { env } from '../config/env.js'

const client = twilio(env.twilioAccountSid, env.twilioAuthToken)

export async function sendPhoneOtp(phone) {
  return client.verify.v2
    .services(env.twilioVerifyServiceSid)
    .verifications.create({ to: phone, channel: 'sms' })
}

export async function verifyPhoneOtp(phone, code) {
  const result = await client.verify.v2
    .services(env.twilioVerifyServiceSid)
    .verificationChecks.create({ to: phone, code })

  return result.status === 'approved'
}

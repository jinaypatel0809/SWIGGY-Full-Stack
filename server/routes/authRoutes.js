import { Router } from 'express'
import {
  getCurrentAccount,
  sendLoginOtp,
  sendRegisterOtp,
  verifyLoginOtp,
  verifyRegisterOtp,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  sendPhoneChangeOtp,
  confirmPhoneChange,
  sendSensitiveActionOtp,
  verifySensitiveActionOtp,
} from '../controllers/authController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = Router()

router.post('/user/register/send-otp', sendRegisterOtp('user'))
router.post('/user/register/verify-otp', verifyRegisterOtp('user'))
router.post('/user/login/send-otp', sendLoginOtp('user'))
router.post('/user/login/verify-otp', verifyLoginOtp('user'))
router.post('/admin/register/send-otp', sendRegisterOtp('admin'))
router.post('/admin/register/verify-otp', verifyRegisterOtp('admin'))
router.post('/admin/login/send-otp', sendLoginOtp('admin'))
router.post('/admin/login/verify-otp', verifyLoginOtp('admin'))
router.post('/user/forgot-password/send-otp', sendForgotPasswordOtp('user'))
router.post('/user/forgot-password/reset', resetPasswordWithOtp('user'))
router.post('/admin/forgot-password/send-otp', sendForgotPasswordOtp('admin'))
router.post('/admin/forgot-password/reset', resetPasswordWithOtp('admin'))
router.get('/me', protect, getCurrentAccount)
router.post('/phone-change/send-otp', protect, sendPhoneChangeOtp)
router.post('/phone-change/confirm', protect, confirmPhoneChange)
router.post('/admin/sensitive/send-otp', protect, requireRole('admin'), sendSensitiveActionOtp)
router.post('/admin/sensitive/verify-otp', protect, requireRole('admin'), verifySensitiveActionOtp)

export default router

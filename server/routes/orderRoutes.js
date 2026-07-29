import { Router } from 'express'
import {
  confirmCodOrder,
  confirmDelivery,
  listAllOrders,
  listMyOrders,
  sendCodOtp,
  sendDeliveryOtp,
  updateOrderStatus,
  cancelMyOrder,
  getAnalytics,
  createOnlineOrder,
  verifyOnlinePayment,
} from '../controllers/orderController.js'
import { protect, requireRole } from '../middleware/auth.js'

const router = Router()

router.post('/cod/send-otp', protect, requireRole('user'), sendCodOtp)
router.post('/cod/confirm', protect, requireRole('user'), confirmCodOrder)
router.post('/online/create', protect, requireRole('user'), createOnlineOrder)
router.post('/online/verify', protect, requireRole('user'), verifyOnlinePayment)
router.get('/mine', protect, requireRole('user'), listMyOrders)
router.get('/admin', protect, requireRole('admin'), listAllOrders)
router.get('/admin/analytics', protect, requireRole('admin'), getAnalytics)
router.patch('/:id/cancel', protect, requireRole('user'), cancelMyOrder)
router.patch('/:id/status', protect, requireRole('admin'), updateOrderStatus)
router.post('/:id/delivery/send-otp', protect, requireRole('admin'), sendDeliveryOtp)
router.post('/:id/delivery/confirm', protect, requireRole('admin'), confirmDelivery)

export default router

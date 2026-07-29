import Order from '../models/Order.js'
import { sendPhoneOtp, verifyPhoneOtp } from '../services/otpService.js'
import Address from '../models/Address.js'
import Account from '../models/Account.js'
import ContentItem from '../models/ContentItem.js'

function normalizeItems(items = []) {
  return items.map((item) => ({
    itemId: String(item.id),
    name: String(item.name).trim(),
    price: Number(item.price),
    quantity: Number(item.quantity),
  }))
}

export async function sendCodOtp(req, res, next) {
  try {
    if (!req.account.phone) return res.status(400).json({ message: 'Verified phone number required' })
    await sendPhoneOtp(req.account.phone)
    res.json({ message: 'COD confirmation OTP sent to your registered phone' })
  } catch (error) {
    next(error)
  }
}

export async function confirmCodOrder(req, res, next) {
  try {
    const items = normalizeItems(req.body.items)
    const location = req.body.location?.trim()
    const address = await Address.findOne({ _id: req.body.addressId, user: req.account._id })
    const otp = req.body.otp?.trim()
    if (!items.length || !location || !otp || !address) {
      return res.status(400).json({ message: 'Cart, delivery address, location and OTP are required' })
    }
    if (!(await verifyPhoneOtp(req.account.phone, otp))) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = Math.round(subtotal * 0.05)
    const deliveryFee = subtotal >= 499 ? 0 : 40
    const total = subtotal + tax + deliveryFee
    const order = await Order.create({
      user: req.account._id,
      items,
      total,
      subtotal,
      tax,
      deliveryFee,
      address: address.toObject(),
      location,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
    })
    res.status(201).json({ message: 'COD order confirmed', order })
  } catch (error) {
    next(error)
  }
}

export async function cancelMyOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.account._id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (!['confirmed', 'preparing'].includes(order.status)) {
      return res.status(400).json({ message: 'This order can no longer be cancelled' })
    }
    order.status = 'cancelled'
    await order.save()
    res.json({ message: 'Order cancelled', order })
  } catch (error) { next(error) }
}

export async function getAnalytics(req, res, next) {
  try {
    const [summary, users, restaurants] = await Promise.all([
      Order.aggregate([
      { $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] } } } },
      ]).then((rows) => rows[0]),
      Account.countDocuments({ role: 'user' }),
      ContentItem.countDocuments({ section: 'restaurant' }),
    ])
    const status = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    res.json({ orders: summary?.orders || 0, revenue: summary?.revenue || 0, users, restaurants, status })
  } catch (error) { next(error) }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.account._id }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (error) {
    next(error)
  }
}

export async function listAllOrders(req, res, next) {
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 })
    res.json({ orders })
  } catch (error) {
    next(error)
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const allowed = ['confirmed', 'preparing', 'out-for-delivery', 'cancelled']
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status' })
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ message: 'Order status updated', order })
  } catch (error) {
    next(error)
  }
}

export async function sendDeliveryOtp(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'phone')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    await sendPhoneOtp(order.user.phone)
    res.json({ message: 'Delivery OTP sent to customer' })
  } catch (error) {
    next(error)
  }
}

export async function confirmDelivery(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'phone')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (!(await verifyPhoneOtp(order.user.phone, req.body.otp?.trim()))) {
      return res.status(400).json({ message: 'Invalid or expired delivery OTP' })
    }
    order.status = 'delivered'
    if (order.paymentMethod === 'cod') order.paymentStatus = 'paid'
    await order.save()
    res.json({ message: 'Delivery confirmed', order })
  } catch (error) {
    next(error)
  }
}

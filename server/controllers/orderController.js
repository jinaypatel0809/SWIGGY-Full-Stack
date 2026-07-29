import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import Order from '../models/Order.js'
import { env } from '../config/env.js'
import { sendPhoneOtp, verifyPhoneOtp } from '../services/otpService.js'
import Address from '../models/Address.js'
import Account from '../models/Account.js'
import ContentItem from '../models/ContentItem.js'

const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
})

function normalizeItems(items = []) {
  return items.map((item) => ({
    itemId: String(item.id),
    name: String(item.name).trim(),
    price: Number(item.price),
    quantity: Number(item.quantity),
  }))
}

function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.05)
  const deliveryFee = subtotal >= 499 ? 0 : 40
  return { subtotal, tax, deliveryFee, total: subtotal + tax + deliveryFee }
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

    const { subtotal, tax, deliveryFee, total } = calculateTotals(items)
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

export async function createOnlineOrder(req, res, next) {
  let order
  try {
    const items = normalizeItems(req.body.items)
    const location = req.body.location?.trim()
    const address = await Address.findOne({ _id: req.body.addressId, user: req.account._id })
    if (!items.length || !location || !address) {
      return res.status(400).json({ message: 'Cart, delivery address and location are required' })
    }

    const invalidItem = items.some((item) =>
      !item.itemId || !item.name || !Number.isFinite(item.price) || item.price < 0 ||
      !Number.isInteger(item.quantity) || item.quantity < 1)
    if (invalidItem) return res.status(400).json({ message: 'Cart contains an invalid item' })

    const { subtotal, tax, deliveryFee, total } = calculateTotals(items)
    order = await Order.create({
      user: req.account._id,
      items,
      total,
      subtotal,
      tax,
      deliveryFee,
      address: address.toObject(),
      location,
      paymentMethod: 'online',
      paymentStatus: 'pending',
      status: 'payment-pending',
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: `order_${order._id}`,
      notes: { internalOrderId: String(order._id) },
    })
    order.razorpayOrderId = razorpayOrder.id
    await order.save()

    res.status(201).json({
      keyId: env.razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      internalOrderId: order._id,
      customer: {
        name: req.account.name,
        email: req.account.email,
        phone: req.account.phone,
      },
    })
  } catch (error) {
    if (order && !order.razorpayOrderId) await Order.findByIdAndDelete(order._id).catch(() => {})
    next(error)
  }
}

export async function verifyOnlinePayment(req, res, next) {
  try {
    const {
      internalOrderId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body
    if (!internalOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Incomplete Razorpay payment response' })
    }

    const order = await Order.findOne({
      _id: internalOrderId,
      user: req.account._id,
      paymentMethod: 'online',
      razorpayOrderId,
    })
    if (!order) return res.status(404).json({ message: 'Payment order not found' })
    if (order.paymentStatus === 'paid') return res.json({ message: 'Payment already verified', order })

    const expectedSignature = crypto
      .createHmac('sha256', env.razorpayKeySecret)
      .update(`${order.razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')
    const received = Buffer.from(razorpaySignature, 'utf8')
    const expected = Buffer.from(expectedSignature, 'utf8')
    if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    order.razorpayPaymentId = razorpayPaymentId
    order.paymentStatus = 'paid'
    order.status = 'confirmed'
    await order.save()
    res.json({ message: 'Online payment verified', order })
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

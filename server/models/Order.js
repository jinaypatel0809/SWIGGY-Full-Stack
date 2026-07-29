import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, 'Order requires at least one item'],
    },
    total: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    address: {
      label: String,
      recipientName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      pincode: String,
    },
    location: { type: String, required: true, trim: true },
    paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    status: {
      type: String,
      enum: ['confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)

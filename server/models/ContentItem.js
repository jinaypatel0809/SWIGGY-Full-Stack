import mongoose from 'mongoose'

const contentItemSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ['restaurant', 'offer', 'food', 'brand'],
      required: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      index: true,
    },
    location: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    badge: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    restaurantName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentItem',
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('ContentItem', contentItemSchema)

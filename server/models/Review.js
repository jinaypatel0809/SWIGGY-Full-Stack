import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentItem', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
)

reviewSchema.index({ user: 1, restaurant: 1 }, { unique: true })

export default mongoose.model('Review', reviewSchema)

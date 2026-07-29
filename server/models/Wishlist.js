import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentItem', required: true },
  },
  { timestamps: true },
)

wishlistSchema.index({ user: 1, restaurant: 1 }, { unique: true })
export default mongoose.model('Wishlist', wishlistSchema)

import Review from '../models/Review.js'
import Wishlist from '../models/Wishlist.js'

export async function listReviews(req, res, next) {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'name').sort({ createdAt: -1 })
    res.json({ reviews })
  } catch (error) { next(error) }
}

export async function saveReview(req, res, next) {
  try {
    const review = await Review.findOneAndUpdate(
      { user: req.account._id, restaurant: req.params.restaurantId },
      { rating: req.body.rating, comment: req.body.comment },
      { upsert: true, new: true, runValidators: true },
    )
    res.json({ review })
  } catch (error) { next(error) }
}

export async function toggleWishlist(req, res, next) {
  try {
    const filter = { user: req.account._id, restaurant: req.params.restaurantId }
    const existing = await Wishlist.findOne(filter)
    if (existing) {
      await existing.deleteOne()
      return res.json({ wished: false })
    }
    await Wishlist.create(filter)
    res.json({ wished: true })
  } catch (error) { next(error) }
}

export async function listWishlist(req, res, next) {
  try {
    const entries = await Wishlist.find({ user: req.account._id }).populate('restaurant')
    res.json({ restaurants: entries.map((entry) => entry.restaurant).filter(Boolean) })
  } catch (error) { next(error) }
}

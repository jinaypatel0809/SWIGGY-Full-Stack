import { Router } from 'express'
import { listReviews, listWishlist, saveReview, toggleWishlist } from '../controllers/reviewController.js'
import { protect, requireRole } from '../middleware/auth.js'
const router = Router()
router.get('/restaurant/:restaurantId', listReviews)
router.put('/restaurant/:restaurantId', protect, requireRole('user'), saveReview)
router.post('/wishlist/:restaurantId', protect, requireRole('user'), toggleWishlist)
router.get('/wishlist', protect, requireRole('user'), listWishlist)
export default router

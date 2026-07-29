import { Router } from 'express'
import { createAddress, deleteAddress, listAddresses, updateAddress } from '../controllers/addressController.js'
import { protect, requireRole } from '../middleware/auth.js'
const router = Router()
router.use(protect, requireRole('user'))
router.get('/', listAddresses)
router.post('/', createAddress)
router.put('/:id', updateAddress)
router.delete('/:id', deleteAddress)
export default router

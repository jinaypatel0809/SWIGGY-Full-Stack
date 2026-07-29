import { Router } from 'express'
import {
  createContent,
  deleteContent,
  listContent,
  updateContent,
  getContent,
} from '../controllers/contentController.js'
import { protect, requireRole, requireSensitiveAction } from '../middleware/auth.js'

const router = Router()

router.get('/', listContent)
router.get('/:id', getContent)
router.post('/', protect, requireRole('admin'), createContent)
router.put('/:id', protect, requireRole('admin'), updateContent)
router.delete('/:id', protect, requireRole('admin'), requireSensitiveAction, deleteContent)

export default router

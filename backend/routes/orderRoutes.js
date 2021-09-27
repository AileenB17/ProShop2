import express from 'express'
const router = express.Router()
import { addOrderItems } from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

//To post created new order
router.route('/').post(protect, addOrderItems)

export default router

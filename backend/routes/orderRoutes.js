import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

//To post created new order | To get all orders (admin access only)
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)

//To get logged in users' orders
router.route('/myorders').get(protect, getMyOrders)

//To get a specific order
//any route with '/:id', make sure to put below the same route group because if not, anything we'll put after '/', it will treat as an :id
router.route('/:id').get(protect, getOrderById)

//To update order to paid
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router

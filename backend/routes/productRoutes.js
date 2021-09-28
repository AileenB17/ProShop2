import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts)

//To get, delete and update product for admin user's access only
//any route with '/:id', make sure to put below the same route group because if not, anything we'll put after '/', will be treated as an :id
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct)

export default router

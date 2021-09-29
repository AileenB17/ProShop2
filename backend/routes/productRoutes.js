import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

//To get product list | and post created product (admin user's access only)
router.route('/').get(getProducts).post(protect, admin, createProduct)

//To get, delete and update product for admin user's access only
//any route with '/:id', make sure to put below the same route group because if not, anything we'll put after '/', will be treated as an :id
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)

export default router

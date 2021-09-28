import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

//for user registration | and getting all users with protected route for admin users' access only
router.route('/').post(registerUser).get(protect, admin, getUsers)

router.post('/login', authUser)

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

//To delete user for admin user's access only
//any route with '/:id', make sure to put below the same route group because if not, anything we'll put after '/', will be treated as an :id
router.route('/:id').delete(protect, admin, deleteUser)

export default router

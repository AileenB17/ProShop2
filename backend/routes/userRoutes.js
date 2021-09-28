import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

//for user registration | and getting all users with protected route for admin users' access only
router.route('/').post(registerUser).get(protect, admin, getUsers)

router.post('/login', authUser)

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router

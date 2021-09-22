import asyncHandler from 'express-async-handler'
import { generateToken } from '../utils/generateToken.js'
import { User } from '../models/userModel.js'

//@desc Auth user & get token | @route POST /api/users/login | @access Public
export const authUser = asyncHandler(async (req, res) => {
  //from req.body, we only need email & password
  //email & pw are passed in from the login action
  const { email, password } = req.body

  //find in the user list the email that will match email from req.body
  const user = await User.findOne({ email })

  //check if the user exist and if password is correct
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc Register a new user | @route POST /api/users | @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400) //bad request status
    throw new Error('User already exists')
  }

  //password will be saved as hashed and not as plain text based on the middleware declared in userModel
  //even though this is create, this is same as save in the userModel middleware called in "pre" method
  const user = await User.create({
    name,
    email,
    password,
  })

  //if user is successfully created, send the data for authentication
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), //include token because we want to authenticate after registration
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//@desc Get user profile | @route GET /api/users/profile | @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

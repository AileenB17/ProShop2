import asyncHandler from 'express-async-handler'
import { User } from '../models/userModel.js'

//@desc Auth user & get token | @route POST /api/users/login | @access Public
export const authUser = asyncHandler(async (req, res) => {
  //from req.body, we only need email & password
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
      token: null,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { User } from '../models/userModel.js'

export const protect = asyncHandler(async (req, res, next) => {
  //initialize token variable
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //to split the token from "Bearer" thru empty space
      token = req.headers.authorization.split(' ')[1]

      //decode the token by jwt.verify so we can have access to the payload (incl. user id) that has been passed in thru generateToken
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      //we don't want to return in the password in the req.user. This req.user can now be accessed with all of our protected routes.
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

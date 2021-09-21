import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
)

//use bcryptjs method 'compare' to check if entered password matched this.password (user's hashed password)
//matchPassword function can now be called in controller

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//define the middleware to encrypt password before saving the data from user registration

userSchema.pre('save', async function (next) {
  //check if the password field is new data or modified as we don't want to create new hash if there's a profile update only
  // use mongoose method isModified to check which field you want to know if modified or not
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10) //to hash password asynchronously
  this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.model('User', userSchema)

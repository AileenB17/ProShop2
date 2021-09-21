import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// Notes:
// (id) - generateToken function will take in the userId that we want to add as the payload in the token
// arguments inside sign method: [1] payload, [2] secret, [3] options like expiration of token

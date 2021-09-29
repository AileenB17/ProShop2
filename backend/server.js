import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { connectDB } from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

//calling the connection to database
connectDB()

//initializing express
const app = express()

//allow us to accept json data in the body (req.body)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running...')
})

//Access routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

//PayPal Config Route
//what we'll do is when we're ready to make a payment, we'll hit this route and fetch this Client ID
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

//__dirname this is not available in es modules so use path.resolve() to act the same way
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//Custom error handling
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

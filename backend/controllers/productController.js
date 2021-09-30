import asyncHandler from 'express-async-handler'
import { Product } from '../models/productModel.js'

//@desc Fetch all products | @route GET /api/products | @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})

  res.json(products)
})

// @desc Fetch single product | @route GET /api/products/:id | @access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc Delete a product | @route DELETE /api/products/:id | @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc Create a product | @route POST /api/products | @access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  //assign values to properties of product schema as we have received empty object only from the createProduct action.
  //Ratings and reviews will take in default values.
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc Update a product | @route PUT /api/products/:id | @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  //requesting the data that has been sent to the body (from the form passed in thru the action)
  const { name, price, description, image, brand, category, countInStock } =
    req.body

  //req.params.id comes from the id in the route that has been sent by the action
  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc Create new review | @route POST /api/products/:id/reviews | @access Private
export const createProductReview = asyncHandler(async (req, res) => {
  //get from req.body the fields below
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    //check if logged in user has already submitted a review in the selected product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    //if logged in user has not given a review yet,
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    //to compute updated average product.rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

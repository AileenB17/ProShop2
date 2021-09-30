import asyncHandler from 'express-async-handler'
import { Product } from '../models/productModel.js'

//@desc Fetch all products | @route GET /api/products | @access Public
export const getProducts = asyncHandler(async (req, res) => {
  //using req.query, we can access the keyword & pageNumber that has been passed in from the listProducts action (ex: ?keyword=${value})

  //set up pagination functionality
  //return '1' in the page if there is no pageNumber passed in (meaning we are only in page 1)
  const pageSize = 8
  const page = Number(req.query.pageNumber) || 1

  //match the queried keyword with the name of the product
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, //use regex to search without the need to match the full product name
          $options: 'i', //case insensitive
        },
      }
    : {} //else return empty if the keyword passed in is just empty string

  //count products (use of ...keyword explained below)
  const count = await Product.countDocuments({ ...keyword })

  //use of ...keyword - whatever the keyword value above either empty or matched / part of name
  //use of limit and skip to match the pageSize with number and arrangement of products to be shown
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
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

    //to add in the reviews array the new review submitted
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

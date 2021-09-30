import asyncHandler from 'express-async-handler'
import { Order } from '../models/orderModel.js'

//@desc Create new order | @route POST /api/orders | @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  //requesting the data that has been sent to the body (from the form passed in thru the action)
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, //we have access on this thru protect middleware
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

//@desc Get order by ID | @route GET /api/orders/:id | @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )
  //.poulate('user', 'name email') = populate from User model the user's name and email, and we can attach this to the Order

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

//@desc Update order to paid | @route PUT /api/orders/:id/pay | @access Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  //if order is found, update below order properties and save
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()

    //will come from PayPal response that is passed in thru the payOrder action
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder) //send back the updatedOrder to orderAction
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

//Sec.10 #64 Show orders on Profile
//@desc Get logged in user orders | @route GET /api/orders/myorders | @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  //filter orders with userId matching with the logged in userId
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

//@desc Get all orders | @route GET /api/orders | @access Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})
//User schema is referenced in the Order schema | populate from user model, and get the user id and name

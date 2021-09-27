import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from '../components/Message'
import { CheckoutSteps } from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'

export const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  //in this screen, we will be needing the whole cart state
  const cart = useSelector((state) => state.cart)

  //Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  //if the order has been successfully placed (success from state.orderCreate), this will redirect to Order Screen
  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`) //we did not put as dependency the order._id as this is not existing yet
    }
    // eslint-disable-next-line
  }, [history, success])

  const placeOrderHandler = () => {
    //Dispatch createOrder action and passed in the order object (destructured to assign the values)
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        // paymentMethod: cart.paymentMethod, //Brad's code as he did not save in local storage
        paymentMethod: cart.paymentMethod.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }

  return (
    <>
      {/* PlaceOrder Screen should passed in all props from step1 to step4 to CheckoutSteps component */}
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <strong>Method: </strong>

              {/* //Brad's original code but showing blank screen unless with hard refresh and then no data saved in localStorage */}
              {/* {cart.paymentMethod} */}

              {/* //use this if getting from localStorage */}
              {cart.paymentMethod.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Order Items</h3>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        {/* item.product here is the id of the product as declared in the addToCart action payload */}
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {' '}
                            {item.name}{' '}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {Number(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h3>Order Summary</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item className='d-grid gap-2'>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

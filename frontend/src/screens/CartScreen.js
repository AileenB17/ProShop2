import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { Message } from '../components/Message'
import { addToCart } from '../actions/cartActions'

export const CartScreen = ({ match, location, history }) => {
  // if params contains this [ '/cart/:id?qty=1 ] , we can fetch id and qty thru below codes
  const productId = match.params.id

  // location.search is used to query qty after '?'
  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  // dispatch addToCart action only if there's productId, and not from clicking 'Cart' in navbar
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  return <div>Cart</div>
}

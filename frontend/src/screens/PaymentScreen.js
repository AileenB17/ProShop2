import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FormContainer } from '../components/FormContainer'
import { CheckoutSteps } from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

export const PaymentScreen = ({ history }) => {
  //in this screen, we also need the shippingAddress from the cart state for checking
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  //if the user has no shipping address yet, redirect them to '/shipping' to enter shipping address
  if (!shippingAddress) {
    history.push('/shipping')
  }

  //component level state for the PaymentScreen form
  //useState('Paypal") - set default payment method to Paypal
  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()

    //dispatch action (save payment method)
    dispatch(savePaymentMethod({ paymentMethod }))

    //redirect to '/placeorder' after payment method is entered
    history.push('/placeorder')
  }

  return (
    <FormContainer>
      {/* PaymentScreen should only passed in props {step1} Sign In, {step2} Shipping, and {step3} Payment to the CheckoutSteps component */}
      <CheckoutSteps step1 step2 step3 />

      <h2>Payment Method</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>

          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked //make this checked by default
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            {/* Stripe - alternative payment method option only - will be comment out later*/}
            {/* <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check> */}
          </Col>
        </Form.Group>

        <Button className='mt-3' type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

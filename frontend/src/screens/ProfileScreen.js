import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from '../components/Message'
import { Loader } from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'

export const ProfileScreen = ({ location, history }) => {
  //component level state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile')) //'profile' will be passed in to the action as the (id) not an actual user id
      } else {
        //else, display user's name and email once the profile loads
        //this will only run after we successfully loaded the user data after dispatching getUserDetails action)
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, history, user, userInfo])

  //dispatch update profile action after checking of password and confirm password
  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      //Dispatch Update Profile and passed in the user object (destructured)
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }

  return (
    <Row>
      <Col md={3}>
        <h3>User Profile</h3>

        {/* this will come from submitHandler condition (message as component level state) */}
        {message && <Message variant='danger'>{message}</Message>}

        {error && <Message variant='danger'>{error}</Message>}

        {/* send a message after successfully updating the profile */}
        {success && <Message variant='success'>Profile Updated</Message>}

        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password Address</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button className='mt-3' type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
      </Col>
    </Row>
  )
}

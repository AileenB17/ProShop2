import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

//history will be undefined in this component because we do not have direct access on this history prop
//So in Header.js, in which this component will be embedded, we will import Route from react router dom to access history prop
export const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      //if there's no searched keyword, redirect to HomeScreen
      history.push('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        // className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='secondary' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { Rating } from './Rating'

export const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body className='d-flex flex-column justify-content-between'>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>{product.name}</Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h6'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

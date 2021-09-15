import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Product } from '../components/Product'
import products from '../products'

export const HomeScreen = () => {
  return (
    <>
      <h2>Latest Products</h2>

      <Row>
        {products.map((product) => (
          <Col
            key={product._id}
            className='align-items-stretch d-flex'
            sm={12}
            md={6}
            lg={4}
            xl={3}
          >
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

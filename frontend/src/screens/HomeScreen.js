import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import products from '../products'

const HomeScreen = () => {
  return (
    <>
      <h2>Latest Products</h2>

      <Row>
        {/* <CardGroup> */}
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
        {/* </CardGroup> */}
      </Row>
    </>
  )
}

export default HomeScreen

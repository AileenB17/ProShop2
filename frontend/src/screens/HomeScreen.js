import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Product } from '../components/Product'
import axios from 'axios'

export const HomeScreen = () => {
  const [products, setProducts] = useState([])

  //everytime the component loads, useEffect will run
  //and will trigger a function to fetch the data and update the products state
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products')

      setProducts(data)
    }
    fetchProducts()
  }, [])

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

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { Product } from '../components/Product'
import { Message } from '../components/Message'
import { Loader } from '../components/Loader'
import { Paginate } from '../components/Paginate'
import { listProducts } from '../actions/productActions'

export const HomeScreen = ({ match }) => {
  // we have access on match.params.keyword & pageNumber thru routes declared in App.js (ex: path='/search/:keyword')
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  //pulling part of state using useSelector
  const productList = useSelector((state) => state.productList)
  const { loading, error, products, pages, page } = productList

  //everytime the component loads & dependecy is changed, useEffect will run
  //and will trigger a function to fetch the data (thru dispatch action) and update the products state (thru reducer)

  useEffect(() => {
    //passing in keyword and pageNumber to listProducts action
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <h2>Latest Products</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
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
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

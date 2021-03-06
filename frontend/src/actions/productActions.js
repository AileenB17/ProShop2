import axios from 'axios'
import {
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
} from '../constants/productConstants'

//passing in from the HomeScreen the keyword and pageNumber but assigning here the default value as empty string
//so we can still make the route worked even if no value of keyword and pageNumber has been sent
export const listProducts =
  (keyword = '', pageNumber = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST })

      //{data} property is coming from the axios --- this is how we fetch data from backend based on what the controller will return
      //add query (?) here to: [1] Collect the keyword if search box is used or this can be an empty string
      //[2] use '&' to add the another query pageNumber (use '&' to any addtl query)
      const { data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      )

      //payload contains different objects inside {data} such as data.products, data.page so account properly when sending to reducers
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data })
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

//function needs to take in an id
export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    //{data} property is coming from the axios --- this is how we fetch data from backend
    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    })

    //this will give us access to the logged in user's object
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers and passed the token here thru protected routes
    const config = {
      headers: {
        // 'Content-Type': 'application/json', //not needed if GET/DELETE request
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //DELETE request - const {data} is not needed as we are not expecting a return of data from the controller
    await axios.delete(`/api/products/${id}`, config)

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    })

    //this will give us access to the logged in user's object
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers and passed the token here thru protected routes
    const config = {
      headers: {
        // 'Content-Type': 'application/json', //not needed
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //POST request passing in the route, empty object (sample default), and the config
    //passing an empty object {} - we are making post request but we are actually not sending any details from the form to the backend
    const { data } = await axios.post(`/api/products/`, {}, config)

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    })

    //this will give us access to the logged in user's object
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers and passed the token here thru protected routes
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //PUT (update) request passing in the route with /:id (product._id), product object, and the config
    //The updateProduct controller will return updatedProduct object
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    )

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createProductReview =
  (productId, review) => async (dispatch, getState) => {
    try {
      dispatch({
        type: PRODUCT_CREATE_REVIEW_REQUEST,
      })

      //this will give us access to the logged in user's object
      const {
        userLogin: { userInfo },
      } = getState()

      //Sending headers and passed the token here thru protected routes
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      //POST request passing in the route with /:id (productId), review object, and the config
      //{data} is not needed as the createProductReview controller is not going to return any data object
      await axios.post(`/api/products/${productId}/reviews`, review, config)

      dispatch({
        type: PRODUCT_CREATE_REVIEW_SUCCESS,
      })
    } catch (error) {
      dispatch({
        type: PRODUCT_CREATE_REVIEW_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST })

    //GET request passing in the route
    //The getTopProducts controller will return products (filtered by top rating)
    const { data } = await axios.get(`/api/products/top`)

    dispatch({ type: PRODUCT_TOP_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

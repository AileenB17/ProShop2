import axios from 'axios'
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
} from '../constants/orderConstants'

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    })

    //this will give us access to the logged in user's object
    //using this will return userInfo (destructured form of state.userLogin.userInfo)
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers with application json type and passed the token here thru protected routes
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //POST request passing in the route, order object, and the config (token will be checked in the authMiddleware thru protect function)
    //If orderItems exists, the addOrderItems controller will return the createdOrder object
    const { data } = await axios.post(`/api/orders`, order, config)

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    })

    //this will give us access to the logged in user's object
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers and passed the token here thru protected routes
    const config = {
      headers: {
        // 'Content-Type': 'application/json', //not needed in GET request?
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //GET request passing in the route with orderId (id); and the config (token will be checked in the authMiddleware thru protect function)
    //If order exists, the getOrderById controller will return order object
    const { data } = await axios.get(`/api/orders/${id}`, config)

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

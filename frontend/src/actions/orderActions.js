import axios from 'axios'
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
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

export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ORDER_PAY_REQUEST,
      })

      //this will give us access to the logged in user's object
      const {
        userLogin: { userInfo },
      } = getState()

      //Sending headers with application/json type and passed the token here thru protected routes
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      //PUT (update) request passing in the route with id (orderId), paymentResult, and the config
      //If order exists, the updateOrderToPaid controller will return updated order object
      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      )

      dispatch({
        type: ORDER_PAY_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST,
    })

    //this will give us access to the logged in user's object
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers and passed the token here thru protected routes
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //PUT (update) request passing in the route with id (orderId), empty object and the config
    //The updateOrderToDelivered controller will return updated order object
    const { data } = await axios.put(
      `/api/orders/${order._id}/deliver`,
      {}, //pass an empty object as we are not sending any data but values will be updated in the controller
      config
    )

    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_MY_REQUEST,
    })

    //this will give us access to the logged in user's object
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers and passed the token here thru protected routes
    const config = {
      headers: {
        // 'Content-Type': 'application/json', //not needed if GET request
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //GET request passing in the route and the config (token will be checked in the authMiddleware thru protect function)
    //The getMyOrders controller will return orders by the logged in user
    const { data } = await axios.get(`/api/orders/myorders`, config)

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST,
    })

    //this will give us access to the logged in user's object
    const {
      userLogin: { userInfo },
    } = getState()

    //Sending headers and passed the token here thru protected routes
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    //GET request passing in the route and the config (token will be checked in the authMiddleware thru protect function)
    //The getOrders controller will return all orders
    const { data } = await axios.get(`/api/orders`, config)

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

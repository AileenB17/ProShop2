import axios from 'axios'
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
} from '../constants/userConstants'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    //In sending data, we need headers with application json type and token will be passed here thru protected routes
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    //Post request with email & password and the config
    //If user is authenticated, the authUser controller will return user data & token
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    )

    //after login request, dispatch USER_LOGIN_SUCCESS and send the {data} we got from above
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    //in saving to localStorage, JSON data needs to be stringified
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })

  //dispatch of  user details and order list my Reset will empty the state upon logout
  //so when a new user log in, order and details of previous logged in user will not be shown
  // dispatch({ type: USER_DETAILS_RESET })
  // dispatch({ type: ORDER_LIST_MY_RESET })

  // dispatch({ type: USER_LIST_RESET })
}

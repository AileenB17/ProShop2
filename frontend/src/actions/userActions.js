import axios from 'axios'
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants'
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
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
  dispatch({ type: USER_DETAILS_RESET })
  dispatch({ type: ORDER_LIST_MY_RESET })

  // dispatch({ type: USER_LIST_RESET })
}

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    })

    //In sending data, we need headers with application json type and token will be passed here thru protected routes
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    //Post request with name, email & password; and the config
    //If user is authenticated, the registerUser controller will return user data & token
    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    )

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    })

    //after successful user registration, logged in the user.
    //We also have access to user data (same details return from authUser & registerUser)
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    })

    //this will give us access to the logged in user's token
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

    //GET request passing in the route with profile(id); and the config (token will be checked in the authMiddleware thru protect function)
    //If user exists, the getUserProfile controller will return user data
    const { data } = await axios.get(`/api/users/${id}`, config)

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    })

    //this will give us access to the logged in user's token
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

    //PUT (update) request passing in the route, user object, and the config (token will be checked in the authMiddleware thru protect function)
    //If user exists, the updateUserProfile controller will return updated user object
    const { data } = await axios.put(`/api/users/profile`, user, config)

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    })

    //add this user login to show the updated changes in the navbar username
    // dispatch({
    //   type: USER_LOGIN_SUCCESS,
    //   payload: data,
    // })

    // //after user login success, this will update the localstorage
    // localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

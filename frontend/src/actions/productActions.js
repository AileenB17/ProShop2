import axios from 'axios'
import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
} from '../constants/productConstants'

//action creator - listProduct
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })

    //{data} property is coming from the axios --- this is how we fetch data from backend
    const { data } = await axios.get('/api/products')

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

import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants'

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload

      //to check if the item is already added to cart
      const existItem = state.cartItems.find((x) => x.product === item.product)

      //if item already exist in the cartItems, replace it with the item (action.payload)
      //will not increase the qty in the cart of same item but will replace it (for improvement)
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        }
      } else {
        //spread with what's already in the state & set cartItems to an array with current items plus new item
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        }
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      }

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state, //copy initial state
        shippingAddress: action.payload, //add shippingAddress object to the cart state (data from the form passed in to the action)
      }

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state, //copy initial state
        paymentMethod: action.payload, //add paymentMethod object to the cart state (data from the PaymentScreen)
      }
    default:
      return state
  }
}

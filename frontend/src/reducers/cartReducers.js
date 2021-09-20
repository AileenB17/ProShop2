import { CART_ADD_ITEM } from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [] }, action) => {
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

    default:
      return state
  }
}

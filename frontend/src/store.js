import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer } from './reducers/productReducers'

//names inside this combineReducers are the parts of state that will be selected by useSelector (ex: state.productList)
const reducer = combineReducers({
  productList: productListReducer,
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store

// 'store' will then be imported in the main root file which is the index.js.
// thru the imported store that wrapped App.js, our app can now access all the data and states.

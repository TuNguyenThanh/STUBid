import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  categoryProductRequest: [],
  categoryProductSuccess: ['categoryProduct'],
  categoryProductFailure: ['error'],
})

export const CategoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  categoryProduct: [],
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const categoryProductSuccess = (state, { categoryProduct }) => state.merge({ fetching: false, error: null, categoryProduct })

// we've had a problem logging in
export const failure = (state, { error }) => state.merge({ fetching: false, error })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CATEGORY_PRODUCT_REQUEST]: request,
  [Types.CATEGORY_PRODUCT_SUCCESS]: categoryProductSuccess,
  [Types.CATEGORY_PRODUCT_FAILURE]: failure,
})

/* ------------- Selectors ------------- */

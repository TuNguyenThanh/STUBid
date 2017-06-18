import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  uploadProductRequest: ['token', 'product'],
  uploadProductSuccess: [],
  uploadProductFailure: ['error'],
})

export const ProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: null,
  fetching: false,
  uploadSuccess: false,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

export const uploadProductSuccess = (state) => state.merge({ fetching: false, error: null, uploadSuccess: true })

export const uploadProductFailure = (state, { error }) => state.merge({ fetching: false, error, uploadSuccess: false })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPLOAD_PRODUCT_REQUEST]: request,
  [Types.UPLOAD_PRODUCT_SUCCESS]: uploadProductSuccess,
  [Types.UPLOAD_PRODUCT_FAILURE]: uploadProductFailure,
})

/* ------------- Selectors ------------- */

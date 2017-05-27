import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  auctionsRequest: ['page'],
  auctionsSuccess: ['data'],
  auctionsFailure: ['error'],

  bidProductRequest: ['auctionId', 'accountId', 'priceBid'],
  bidProductSuccess: ['bidSuccess'],
  bidProductFailure: ['error'],
})

export const AuctionsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false,
  bidSuccess: null,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const bidProductSuccess = (state, { bidSuccess }) => state.merge({ fetching: false, error: null, bidSuccess })

// we've had a problem logging in
export const failure = (state, { error }) => state.merge({ fetching: false, error })

export const bidProductRequest = (state) => state.merge({ })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUCTIONS_REQUEST]: request,
  [Types.AUCTIONS_SUCCESS]: success,
  [Types.AUCTIONS_FAILURE]: failure,

  [Types.BID_PRODUCT_REQUEST]: bidProductRequest,
  // [Types.BID_PRODUCT_SUCCESS]: bidProductSuccess,
  // [Types.BID_PRODUCT_FAILURE]: failure,
})

/* ------------- Selectors ------------- */

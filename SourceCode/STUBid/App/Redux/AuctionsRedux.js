import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  auctionsRequest: ['page'],
  auctionsSuccess: ['data'],
  auctionsFailure: ['error'],
})

export const AuctionsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state, { data }) => state.merge({ fetching: false, error: null, data })

// we've had a problem logging in
export const failure = (state, { error }) => state.merge({ fetching: false, error })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUCTIONS_REQUEST]: request,
  [Types.AUCTIONS_SUCCESS]: success,
  [Types.AUCTIONS_FAILURE]: failure,
})

/* ------------- Selectors ------------- */

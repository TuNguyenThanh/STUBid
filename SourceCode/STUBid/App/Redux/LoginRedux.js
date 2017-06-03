import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: ['user'],
  loginFailure: ['error'],
  logout: [],

  loginTokenRequest: ['token'],
  loginTokenSuccess: ['user'],
  loginTokenFailure: ['error'],

})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  user: null,
  error: null,
  fetching: false,
  fetchingLoginToken: false,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

export const requestToken = (state) => state.merge({ fetchingLoginToken: true })

// we've successfully logged in
export const success = (state, { user }) => state.merge({ fetching: false, error: null, user })

export const successToken = (state, { user }) => state.merge({ fetchingLoginToken: false, error: null, user })

// we've had a problem logging in
export const failure = (state, { error }) => state.merge({ fetching: false, error })

export const failureToken = (state, { error }) => state.merge({ fetchingLoginToken: false, error })

// we've logged out
export const logout = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGOUT]: logout,

  [Types.LOGIN_TOKEN_REQUEST]: requestToken,
  [Types.LOGIN_TOKEN_SUCCESS]: successToken,
  [Types.LOGIN_TOKEN_FAILURE]: failureToken,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState) => loginState.username !== null

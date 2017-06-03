import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  accountRegisterRequest: ['info'],
  accountRegisterSuccess: ['success'],
  accountRegisterFailure: ['error'],

  checkCodeRequest: ['code', 'email', 'username', 'phoneNumber'],
  checkCodeSuccess: ['codeSuccess'],
  checkCodeFailure: ['error'],

  getNewCodeRequest: ['email', 'username', 'phoneNumber'],
  getNewCodeSuccess: ['newCode'],
  getNewCodeFailure: ['error'],

  forgotPasswordRequest: ['email'],
  forgotPasswordSuccess: ['forgotPasswordSuccess'],
  forgotPasswordFailure: ['error'],
})

export const AccountTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: null,
  fetching: false,
  success: false,
  codeSuccess: false,
  newCode: null,
  forgotPasswordSuccess: null,
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state, { success }) => state.merge({ fetching: false, error: null, success })

export const checkCodeSuccess = (state, { codeSuccess }) => state.merge({ fetching: false, error: null, codeSuccess })

export const getNewCodeSuccess = (state, { newCode }) => state.merge({ fetching: false, error: null, newCode })

export const forgotPasswordSuccess = (state, { forgotPasswordSuccess }) => state.merge({ fetching: false, error: null, forgotPasswordSuccess })

// we've had a problem logging in
export const failure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ACCOUNT_REGISTER_REQUEST]: request,
  [Types.ACCOUNT_REGISTER_SUCCESS]: success,
  [Types.ACCOUNT_REGISTER_FAILURE]: failure,

  [Types.CHECK_CODE_REQUEST]: request,
  [Types.CHECK_CODE_SUCCESS]: checkCodeSuccess,
  [Types.CHECK_CODE_FAILURE]: failure,

  [Types.GET_NEW_CODE_REQUEST]: success,
  [Types.GET_NEW_CODE_SUCCESS]: getNewCodeSuccess,
  [Types.GET_NEW_CODE_FAILURE]: failure,

  [Types.FORGOT_PASSWORD_REQUEST]: success,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_PASSWORD_FAILURE]: failure,
})

/* ------------- Selectors ------------- */

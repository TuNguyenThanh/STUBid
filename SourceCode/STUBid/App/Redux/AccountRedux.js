import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  accountRegisterRequest: ['info'],
  accountRegisterSuccess: [],
  accountRegisterFailure: ['error'],

  checkCodeRequest: ['code', 'email', 'username', 'phoneNumber'],
  checkCodeSuccess: [],
  checkCodeFailure: ['error'],

  getNewCodeRequest: ['email', 'username', 'phoneNumber'],
  getNewCodeSuccess: [],
  getNewCodeFailure: ['error'],

  forgotPasswordRequest: ['email'],
  forgotPasswordSuccess: [],
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
  newCode: false,
  forgotPasswordSuccess: false,
})

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })

export const success = (state) => state.merge({ fetching: false, error: null, success: true })

export const failure = (state, { error }) => state.merge({ fetching: false, error, success: false })

export const checkCodeSuccess = (state, { codeSuccess }) => state.merge({ fetching: false, error: null, codeSuccess: true })

export const checkCodeFailure = (state, { error }) => state.merge({ fetching: false, error, codeSuccess: false })

export const getNewCodeSuccess = (state, { newCode }) => state.merge({ fetching: false, error: null, newCode: true })

export const getNewCodeFailure = (state, { error }) => state.merge({ fetching: false, error, newCode: false })

export const forgotPasswordSuccess = (state, { forgotPasswordSuccess }) => state.merge({ fetching: false, error: null, forgotPasswordSuccess: true })

export const forgotPasswordFailure = (state, { error }) => state.merge({ fetching: false, error, forgotPasswordSuccess: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ACCOUNT_REGISTER_REQUEST]: request,
  [Types.ACCOUNT_REGISTER_SUCCESS]: success,
  [Types.ACCOUNT_REGISTER_FAILURE]: failure,

  [Types.CHECK_CODE_REQUEST]: request,
  [Types.CHECK_CODE_SUCCESS]: checkCodeSuccess,
  [Types.CHECK_CODE_FAILURE]: checkCodeFailure,

  [Types.GET_NEW_CODE_REQUEST]: request,
  [Types.GET_NEW_CODE_SUCCESS]: getNewCodeSuccess,
  [Types.GET_NEW_CODE_FAILURE]: getNewCodeFailure,

  [Types.FORGOT_PASSWORD_REQUEST]: request,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,
})

/* ------------- Selectors ------------- */

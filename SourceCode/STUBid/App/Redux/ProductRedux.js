import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  uploadProductRequest: ['token', 'product', 'accountId'],
  uploadProductSuccess: [],
  uploadProductFailure: ['error'],

  getInfoUploadRequest: [],
  getInfoUploadSuccess: ['dataInfo'],
  getInfoUploadFailure: ['error'],

  getProductUnActivityRequest: ['token'],
  getProductUnActivitySuccess: ['data'],
  getProductUnActivityFailure: ['error'],

  delProductUnActivityRequest: ['token', 'auctionId'],
  delProductUnActivitySuccess: ['dataDel'],
  delProductUnActivityFailure: ['error'],
})

export const ProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: null,
  fetching: false,
  uploadSuccess: false,
  dataInfo: null,
  dataDel: false,
  data: [],
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state) => state.merge({ fetching: true })

export const uploadProductSuccess = (state) => state.merge({ fetching: false, error: null, uploadSuccess: true })

export const uploadProductFailure = (state, { error }) => state.merge({ fetching: false, error, uploadSuccess: false })

export const failure = (state, { error }) => state.merge({ fetching: false, error})

export const success = (state, { dataInfo }) => state.merge({ fetching: false, dataInfo})

export const getProductUnActivitySuccess = (state, { data }) => state.merge({ fetching: false, data })

export const delProductUnActivitySuccess = (state, { dataDel }) => state.merge({ fetching: false, dataDel })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPLOAD_PRODUCT_REQUEST]: request,
  [Types.UPLOAD_PRODUCT_SUCCESS]: uploadProductSuccess,
  [Types.UPLOAD_PRODUCT_FAILURE]: uploadProductFailure,

  [Types.GET_INFO_UPLOAD_REQUEST]: request,
  [Types.GET_INFO_UPLOAD_SUCCESS]: success,
  [Types.GET_INFO_UPLOAD_FAILURE]: failure,

  [Types.GET_PRODUCT_UN_ACTIVITY_REQUEST]: request,
  [Types.GET_PRODUCT_UN_ACTIVITY_SUCCESS]: getProductUnActivitySuccess,
  [Types.GET_PRODUCT_UN_ACTIVITY_FAILURE]: failure,

  [Types.DEL_PRODUCT_UN_ACTIVITY_REQUEST]: request,
  [Types.DEL_PRODUCT_UN_ACTIVITY_SUCCESS]: delProductUnActivitySuccess,
  [Types.DEL_PRODUCT_UN_ACTIVITY_FAILURE]: failure,
})

/* ------------- Selectors ------------- */

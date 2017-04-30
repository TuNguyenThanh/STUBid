import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */
const {Types, Creators} = createActions({
  changeHeight: ['height']
})

export const TabNavigatorTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  height: 65
})

/* ------------- Reducers ------------- */
export const changeHeight = (state, { height }) => state.merge({ height })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_HEIGHT]: changeHeight,
})

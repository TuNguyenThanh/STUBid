import { put } from 'redux-saga/effects'
import TabNavigatorActions from '../Redux/TabNavigatorRedux'

// attempts to login
export function * changeHeight (action) {
  const { height } = action;
  console.log(height);
}

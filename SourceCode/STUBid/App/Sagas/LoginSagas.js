import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import LoginActions from '../Redux/LoginRedux'

// attempts to login
export function * login (api, action) {
  const { username, password } = action;
  try {
    const response = yield call(api.login, username, password);
    if(response.ok) {
      const data = response.data;
      yield put(LoginActions.loginSuccess(data));
    } else {
      yield put(LoginActions.loginFailure(response.problem));
    }
  } catch(e) {
    console.log(e);
  }
}

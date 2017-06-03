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
      if(data.error) {
        console.log(11);
        yield put(LoginActions.loginFailure('error'));
      } else {
        console.log(22);
        yield put(LoginActions.loginSuccess(data));
      }
    } else {
      yield put(LoginActions.loginFailure(response.problem));
    }
  } catch(e) {
    console.log(e);
  }
}

export function * loginToken (api, action) {
  const { token } = action;
  try {
    const response = yield call(api.loginToken, token);
    if(response.ok) {
      const data = response.data;
      if(data.error) {
        yield put(LoginActions.loginTokenFailure(data.error.message));
      } else {
        yield put(LoginActions.loginTokenSuccess(data));
      }
    } else {
      yield put(LoginActions.loginTokenFailure(response.problem));
    }
  } catch(e) {
    console.log(e);
  }
}

import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import LoginActions from '../Redux/LoginRedux'
import { Error } from '../Helper/';

// attempts to login
export function * login (api, action) {
  const { username, password } = action;
  try {
    const response = yield call(api.login, username, password);
    if(response.ok) {
      const data = response.data;
      if(data.error) {
        yield put(LoginActions.loginFailure(Error(data.error.code)));
      } else {
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
        yield put(LoginActions.loginTokenFailure(Error(data.error.code)));
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

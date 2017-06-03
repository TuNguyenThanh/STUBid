import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import AccountActions from '../Redux/AccountRedux'

export function * createAcccount(api, action) {
  // make the call to the api
  const { info } = action;
  const response = yield call(api.createAccount, info);
  if (response.ok) {
    const data = response.ok;
    yield put(AccountActions.accountRegisterSuccess(data));
  } else {
    yield put(AccountActions.accountRegisterFailure(response.problem));
  }
}

export function * checkCode(api, action) {
  // make the call to the api
  const { code, email, username, phoneNumber } = action;
  const response = yield call(api.checkCode, code, email, username, phoneNumber);
  if (response.ok) {
    const data = response.ok;
    yield put(AccountActions.checkCodeSuccess(data));
  } else {
    yield put(AccountActions.checkCodeFailure(response.problem));
  }
}

export function * getNewCode(api, action) {
  // make the call to the api
  const { email, username, phoneNumber } = action;
  //const response = yield call(api.getNewCode, email, username, phoneNumber);
  //console.log(response);
  // if (response.ok) {
  //   const data = response.ok;
  //   yield put(AccountActions.getNewCodeSuccess(data));
  // } else {
  //   yield put(AccountActions.getNewCodeFailure(response.problem));
  // }
}

export function * forgotPassword(api, action) {
  // make the call to the api
  const { email } = action;
  console.log(email);
  //const response = yield call(api.forgotPassword, email);
  //console.log(response);
  // if (response.ok) {
  //   const data = response.ok;
  //   yield put(AccountActions.forgotPasswordSuccess(data));
  // } else {
  //   yield put(AccountActions.forgotPasswordFailure(response.problem));
  // }
}

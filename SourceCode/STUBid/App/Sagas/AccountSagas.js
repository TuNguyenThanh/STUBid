import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import AccountActions from '../Redux/AccountRedux'
import LoginActions from '../Redux/LoginRedux'

export function * createAcccount(api, action) {
  // make the call to the api
  const { info } = action;
  const response = yield call(api.createAccount, info);
  if (response.ok) {
    const data = response.data;
    if(data.error) {
      yield put(AccountActions.accountRegisterFailure(data.error));
    } else {
      yield put(AccountActions.accountRegisterSuccess());
    }
  } else {
    yield put(AccountActions.accountRegisterFailure(response.problem));
  }
}

export function * checkCode(api, action) {
  // make the call to the api
  const { code, email, username, phoneNumber } = action;
  const response = yield call(api.checkCode, code, email, username, phoneNumber);
  if (response.ok) {
    const data = response.data;
    if(data.error) {
      yield put(AccountActions.checkCodeFailure(data.error));
    } else {
      yield put(AccountActions.checkCodeSuccess());
    }
  } else {
    yield put(AccountActions.checkCodeFailure(response.problem));
  }
}

export function * getNewCode(api, action) {
  // make the call to the api
  const { email, username, phoneNumber } = action;
  const response = yield call(api.getNewCode, email, username, phoneNumber);
  if (response.ok) {
    const data = response.data;
    if(data) {
      if(data.error) {
        yield put(AccountActions.getNewCodeFailure(data.error));
      } else {
        yield put(AccountActions.getNewCodeSuccess());
      }
    } else {
      yield put(AccountActions.getNewCodeSuccess());
    }
  } else {
    yield put(AccountActions.getNewCodeFailure(response.problem));
  }
}

export function * forgotPassword(api, action) {
  // make the call to the api
  const { email } = action;
  const response = yield call(api.forgotPassword, email);

  if (response.ok) {
    const data = response.data;
    if(data) {
      if(data.error) {
        yield put(AccountActions.forgotPasswordFailure(data.error));
      } else {
        yield put(AccountActions.forgotPasswordSuccess());
      }
    } else {
      yield put(AccountActions.forgotPasswordSuccess());
    }
  } else {
    yield put(AccountActions.forgotPasswordFailure(response.problem));
  }
}

export function * changePassword(AccountApi, UserApi, action) {
  // make the call to the api
  const { token, oldPassword, newPassword } = action;
  const response = yield call(AccountApi.changePassword, token, oldPassword, newPassword);

  if (response.ok) {
    const data = response.data;
    if(data.success) {
      yield put(AccountActions.changePasswordSuccess());

      //login from new token
      const responseLogin = yield call(UserApi.loginToken, data.token);
      if(response.ok) {
        const dataLogin = responseLogin.data;
        if(dataLogin.error) {
          yield put(LoginActions.loginTokenFailure(dataLogin.error.message));
        } else {
          yield put(LoginActions.loginTokenSuccess(dataLogin));
        }
      } else {
        yield put(LoginActions.loginTokenFailure(responseLogin.problem));
      }

    } else {
      yield put(AccountActions.changePasswordFailure(data.error));
    }
  } else {
    yield put(AccountActions.changePasswordFailure(response.problem));
  }
}

export function * editProfile(AccountApi, UserApi, action) {
  // make the call to the api
  const { info } = action;
  const response = yield call(AccountApi.editProfile, info);

  if (response.ok) {
    const data = response.data;
    if(data.success) {
      yield put(AccountActions.editProfileSuccess());

      //login from new token
      const responseLogin = yield call(UserApi.loginToken, data.token);
      if(response.ok) {
        const dataLogin = responseLogin.data;
        if(dataLogin.error) {
          yield put(LoginActions.loginTokenFailure(dataLogin.error.message));
        } else {
          yield put(LoginActions.loginTokenSuccess(dataLogin));
        }
      } else {
        yield put(LoginActions.loginTokenFailure(responseLogin.problem));
      }

    } else {
      yield put(AccountActions.editProfileFailure(data.error));
    }
  } else {
    yield put(AccountActions.editProfileFailure(response.problem));
  }
}

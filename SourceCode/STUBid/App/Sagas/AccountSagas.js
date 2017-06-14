import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import AccountActions from '../Redux/AccountRedux'
import LoginActions from '../Redux/LoginRedux'
import RNFetchBlob from 'react-native-fetch-blob'
import ApiConfig from '../Config/ApiConfig'

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
      if(responseLogin.ok) {
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
  console.log(response);

  if (response.ok) {
    const data = response.data;
    if(data.success) {
      yield put(AccountActions.editProfileSuccess());

      //login from new token
      const responseLogin = yield call(UserApi.loginToken, data.token);
      if(responseLogin.ok) {
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

export function * uploadAvatar(AccountApi, UserApi, action) {
  const { image, token } = action;
  const res = yield call(AccountApi.uploadAvatar, image, token);
  const response = JSON.parse(res.data);

  if(response.success) {
    yield put(AccountActions.uploadAvatarSuccess());

    //login from new token
    const responseLogin = yield call(UserApi.loginToken, response.token);
    if(responseLogin.ok) {
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
    yield put(AccountActions.uploadAvatarFailure("Failure"));
  }
}

// export function * uploadAvatar(AccountApi, UserApi, action) {
//   const { image, token } = action;
//
//   const nameImage = `image${Math.floor(Date.now() / 1000)}`;
//   var dataResp, isDone = false;
//   try {
//     yield RNFetchBlob.fetch('PATCH', `${ApiConfig.baseURL}Accounts/updateAvatar`, {
//       'Authorization': 'SBID',
//       'otherHeader': 'foo',
//       'App-Name': 'sbid',
//       'Content-Type': 'multipart/form-data',
//     }, [
//       // part file from storage
//       { name: nameImage, filename: nameImage + '.png', type: 'image/png', data: RNFetchBlob.wrap(image) },
//       { name: 'token', data: token }
//     ]).then((resp) => {
//       dataResp = resp;
//       isDone = true;
//     }).catch((error) => {
//       console.log(error);
//     });
//
//     if(isDone && dataResp.data) {
//       yield put(AccountActions.uploadAvatarSuccess());
//
//       const data = JSON.parse(dataResp.data);
//       //login from new token
//       const responseLogin = yield call(UserApi.loginToken, data.token);
//       if(responseLogin.ok) {
//         const dataLogin = responseLogin.data;
//         if(dataLogin.error) {
//           yield put(LoginActions.loginTokenFailure(dataLogin.error.message));
//         } else {
//           yield put(LoginActions.loginTokenSuccess(dataLogin));
//         }
//       } else {
//         yield put(LoginActions.loginTokenFailure(responseLogin.problem));
//       }
//     }
//
//   } catch(e) {
//     console.log(e);
//     yield put(AccountActions.uploadAvatarFailure("Failure"));
//   }
// }

import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import AuctionsActions from '../Redux/AuctionsRedux'
import IO from 'socket.io-client/dist/socket.io'

export function * getAuctions(api, action) {
  // make the call to the api
  const { category, page } = action;
  try {
    while (true) {
      const response = yield call(api.getAuction, category, page);
      if(response) {
        yield put(AuctionsActions.auctionsSuccess(response));
      } else {
        yield put(AuctionsActions.auctionsFailure('WRONG'));
      }
    }
  } catch (e) {
    console.log(e);
  }

  //fetch API JSON
  // const response = yield call(api.getAuction, page);
  // console.log(response);
  // if (response.ok) {
  //   const data = response.data.result;
  //   yield put(AuctionsActions.auctionsSuccess(data));
  // } else {
  //   yield put(AuctionsActions.auctionsFailure(response.problem));
  // }
}

export function * bidProduct(AuctionsApi, UserApi, action) {
  const { token, auctionId, accountId, priceBid, buyNow } = action;
  try {
    const response = yield call(AuctionsApi.bidProduct, token, auctionId, accountId, priceBid, buyNow );
    console.log(response);
    if(response.ok) {
      yield put(AuctionsActions.bidProductSuccess(priceBid));

      //login from new token
      const responseLogin = yield call(UserApi.loginToken, response.data.token);
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
      yield put(AuctionsActions.bidProductFailure(response.problem));
    }
  } catch (e) {
    console.log(e);
  }
}

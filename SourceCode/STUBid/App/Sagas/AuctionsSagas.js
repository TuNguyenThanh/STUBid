import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import AuctionsActions from '../Redux/AuctionsRedux'

export function * getAuctions(api, action) {
  // make the call to the api
  const { page } = action;
  try {
    while (true) {
      const response = yield call(api.getAuction, page);
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

export function * bidProduct(api, action) {
  const { auctionId, accountId, priceBid } = action;
  try {
    const response = yield call(api.bidProduct , auctionId, accountId, priceBid );
    console.log(response);
    if(response.ok) {
      yield put(AuctionsActions.bidProductSuccess('success'));
    } else {
      yield put(AuctionsActions.bidProductFailure(response.problem));
    }
  } catch (e) {
    console.log(e);
  }
}

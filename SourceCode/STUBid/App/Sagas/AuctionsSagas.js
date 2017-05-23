import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import AuctionsActions from '../Redux/AuctionsRedux'

export function * getAuctions(api, action) {
  // make the call to the api
  const { page } = action;
  try {
    while (true) {
      const response = yield call(api.getAuction, page);
      yield put(AuctionsActions.auctionsSuccess(response));
    }
  } catch (e) {
    console.log(e);
  }

  //fetch API JSON
  // const response = yield call(api.getAuction, page);
  // console.log(response);
  // if (response.ok) {
  //   //const data = response.data.result;
  //   yield put(AuctionsActions.auctionsSuccess([]));
  // } else {
  //   yield put(AuctionsActions.auctionsFailure(response.problem));
  // }
}

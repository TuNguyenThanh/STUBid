import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import AuctionsActions from '../Redux/AuctionsRedux'

export function * getAuctions(api, action) {
  // make the call to the api
  const { page } = action;
  const response = yield call(api.getAuction, page);
  if (response.ok) {
    const data = response.data.result;
    yield put(AuctionsActions.auctionsSuccess(data));
  } else {
    yield put(AuctionsActions.auctionsFailure(response.problem));
  }
}

import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import SearchActions from '../Redux/SearchRedux'

export function * searchs(api, action) {
  // make the call to the api
  const { keysearch } = action;
  // while (true) {
  //   const response = yield call(api.getAuctionsByKeySearch, keysearch);
  //   yield put(SearchActions.auctionsSuccess(response));
  // }
}

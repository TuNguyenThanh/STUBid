import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import CategoryActions from '../Redux/CategoryRedux'

export function * getCategory(api, action) {
  //make the call to the api
  const response = yield call(api.getCategory);
  if (response.ok) {
    const data = response.data.result;
    yield put(CategoryActions.categoryProductSuccess(data));
  } else {
    yield put(CategoryActions.categoryProductFailure(response.problem));
  }
}

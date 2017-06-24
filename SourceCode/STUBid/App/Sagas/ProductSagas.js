import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import ProductActions from '../Redux/ProductRedux'
import LoginActions from '../Redux/LoginRedux'
import IO from 'socket.io-client/dist/socket.io'
import RNFetchBlob from 'react-native-fetch-blob'

export function * uploadProduct(ProductApi, UserApi, action) {
  const { token, product } = action;

  try {
    const arrImagePush = [];
    var dataResp, isDone = false;
    for(let i = 0; i < product.image.length ; i++) {
      const nameImage = `image${Math.floor(Date.now() / 1000)}${i}`;
      const newObject = { name: nameImage, filename: nameImage + '.png', type: 'image/png', data: RNFetchBlob.wrap(product.image[i]) }
      arrImagePush.push(newObject);
    }

    const dataProduct = [
      { name: 'token', data: token},
      { name: 'productName', data: product.productName },
      { name: 'description', data: product.productName },
      { name: 'categoryId', data: String(product.categoryId) },
      { name: 'startPrice', data: String(product.startPrice) },
      { name: 'ceilingPrice', data: String(product.ceilingPrice) },
      { name: 'duration', data: String(product.duration) },
      { name: 'bidIncreasement', data: product.bidIncreasement },
      { name: 'productReturningAddress', data: product.productReturningAddress },
      { name: 'moneyReceivingBankRefId', data: String(product.moneyReceivingBankRefId) },
      { name: 'moneyReceivingAddress', data: product.moneyReceivingAddress },
      { name: 'allowedUserLevel', data: String(product.allowedUserLevel) },
    ]
    const dataUpload = dataProduct.concat(arrImagePush);
    const res = yield call(ProductApi.uploadProduct, dataUpload );
    const response = JSON.parse(res.data);
    if(response.success) {
      yield put(ProductActions.uploadProductSuccess());

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
      yield put(ProductActions.uploadProductFailure(response.problem));
    }
  } catch(e) {
    console.log(e);
    yield put(ProductActions.uploadProductFailure('Failure Upload Product'));
  }
}

export function * getInfoUploadProduct(ProductApi, action) {
  try {
    const response = yield call(ProductApi.getInfoUploadProduct);
    if(response.ok) {
      yield put(ProductActions.getInfoUploadSuccess(response.data.html));
    } else {
      yield put(ProductActions.getInfoUploadFailure(response.problem));
    }
  } catch (e) {
    console.log(e);
  }
}

export function * getProductUnActivity(ProductApi, action) {
  try {
    const { token } = action;
    const response = yield call(ProductApi.getProductUnActivity, token);
    if(response.ok) {
      const data = response.data.results;
      yield put(ProductActions.getProductUnActivitySuccess(data));
    } else {
      yield put(ProductActions.getProductUnActivityFailure(response.problem));
    }
  } catch (e) {
    console.log(e);
  }
}

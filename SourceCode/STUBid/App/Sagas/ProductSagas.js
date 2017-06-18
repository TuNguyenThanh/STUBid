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
      { name: 'categoryId', data: product.categoryId },
      { name: 'startPrice', data: product.startPrice },
      { name: 'ceilingPrice', data: product.ceilingPrice },
      { name: 'duration', data: product.duration },
      { name: 'bidIncreasement', data: product.bidIncreasement },
      { name: 'productReturningAddress', data: product.productReturningAddress },
      { name: 'moneyReceivingBankRefId', data: product.moneyReceivingBankRefId },
      { name: 'moneyReceivingAddress', data: product.moneyReceivingAddress },
      { name: 'allowedUserLevel', data: product.allowedUserLevel },
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

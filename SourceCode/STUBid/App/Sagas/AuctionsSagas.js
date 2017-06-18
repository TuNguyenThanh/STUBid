import { call, put, take } from 'redux-saga/effects'
import { path } from 'ramda'
import AuctionsActions from '../Redux/AuctionsRedux'
import LoginActions from '../Redux/LoginRedux'
import IO from 'socket.io-client/dist/socket.io'
import ApiConfig from '../Config/ApiConfig'
import RNFetchBlob from 'react-native-fetch-blob'

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
//
// export function * uploadProduct(AuctionsApi, UserApi, action) {
//   const { token, product } = action;
//
//   try {
//     const arrImagePush = [];
//     var dataResp, isDone = false;
//     for(let i = 0; i < product.image.length ; i++) {
//       const nameImage = `image${Math.floor(Date.now() / 1000)}${i}`;
//       const newObject = { name: nameImage, filename: nameImage + '.png', type: 'image/png', data: RNFetchBlob.wrap(product.image[i]) }
//       arrImagePush.push(newObject);
//     }
//
//     const dataProduct = [
//       { name: 'token', data: token},
//       { name: 'productName', data: product.productName },
//       { name: 'description', data: product.productName },
//       { name: 'categoryId', data: product.categoryId },
//       { name: 'startPrice', data: product.startPrice },
//       { name: 'ceilingPrice', data: product.ceilingPrice },
//       { name: 'duration', data: product.duration },
//       { name: 'bidIncreasement', data: product.bidIncreasement },
//       { name: 'productReturningAddress', data: product.productReturningAddress },
//       { name: 'moneyReceivingBankRefId', data: product.moneyReceivingBankRefId },
//       { name: 'moneyReceivingAddress', data: product.moneyReceivingAddress },
//       { name: 'allowedUserLevel', data: product.allowedUserLevel },
//     ]
//
//     const dataUpload = dataProduct.concat(arrImagePush);
//     yield RNFetchBlob.fetch('POST', `${ApiConfig.baseURL}Auctions/uploadProduct`, {
//       'Authorization': 'SBID',
//       'otherHeader': 'foo',
//       'App-Name': 'sbid',
//       'Content-Type': 'multipart/form-data',
//     }, dataUpload).then((resp) => {
//       console.log(resp);
//       dataResp = resp;
//       isDone = true;
//     }).catch((error) => {
//       console.log(error);
//     });
//
//     if(isDone && dataResp.data) {
//       yield put(AuctionsActions.uploadProductSuccess());
//
//       const data = JSON.parse(dataResp.data);
//       console.log(data);
//       //login from new token
//       const responseLogin = yield call(UserApi.loginToken, data.token);
//       if(responseLogin.ok) {
//         const dataLogin = responseLogin.data;
//         console.log(dataLogin);
//         if(dataLogin.error) {
//           yield put(LoginActions.loginTokenFailure(dataLogin.error.message));
//         } else {
//           yield put(LoginActions.loginTokenSuccess(dataLogin));
//         }
//       } else {
//         yield put(LoginActions.loginTokenFailure(responseLogin.problem));
//       }
//     } else {
//       yield put(AuctionsActions.uploadProductFailure('ERROR'));
//     }
//   } catch(e) {
//     console.log(e);
//     yield put(AuctionsActions.uploadProductFailure('Failure Upload Product'));
//   }
// }

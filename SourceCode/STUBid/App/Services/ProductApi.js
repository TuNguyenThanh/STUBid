// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'
import RNFetchBlob from 'react-native-fetch-blob'

const create = (baseURL = ApiConfig.baseURL) => {
  const headers = ApiConfig.headers;
  const api = apisauce.create({
    baseURL,
    headers,
    timeout: ApiConfig.timeOut,
  });

  // get state working of pro
  const uploadProduct = (dataUpload) => {
    return new Promise(resolve => {
      RNFetchBlob.fetch('POST', `${ApiConfig.baseURL}Auctions/uploadProduct`, {
        'Authorization': 'SBID',
        'otherHeader': 'foo',
        'App-Name': 'sbid',
        'Content-Type': 'multipart/form-data',
      }, dataUpload).then((resp) => {
        resolve(resp)
      }).catch((error) => {
        console.log(error);
        resolve(error)
      });
    });
  }

  return {
    // a list of the API functions from step 2
    uploadProduct
  }
}

// let's return back our create method as the default.
export default { create }

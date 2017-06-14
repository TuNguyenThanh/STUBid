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

  const createAccount = (info) => {
    return api.post('Accounts/register', info);
  }

  const checkCode = (code, email, username, phoneNumber) => {
    return api.post('Accounts/register', { verifyCode: code, email, username, phoneNumber });
  }

  const getNewCode = (email, username, phoneNumber) => {
    return api.post('Accounts/resendVerifyCode', { email, username, phoneNumber });
  }

  const forgotPassword = (email) => {
    return api.post('Accounts/forgotPassword', { email });
  }

  const changePassword = (token, oldPassword, newPassword) => {
    return api.patch('Accounts/changePassword', { token, currentPassword: oldPassword, newPassword });
  }

  const editProfile = (info) => {
    console.log(info);
    return api.patch('Accounts/updateProfile', {
      token: info.token, firstName: info.firstName,
      lastName: info.lastName, phoneNumber: info.phoneNumber,
      email: info.email, bankRef: info.bankRef
    });
  }

  const uploadAvatar = (image, token) => {

    return new Promise(resolve => {
      const nameImage = `image${Math.floor(Date.now() / 1000)}`;
      let dataResp, dataError,isDone = false;
      RNFetchBlob.fetch('PATCH', `${ApiConfig.baseURL}Accounts/updateAvatar`, {
        'Authorization': 'SBID',
        'otherHeader': 'foo',
        'App-Name': 'sbid',
        'Content-Type': 'multipart/form-data',
      }, [
        // part file from storage
        { name: nameImage, filename: nameImage + '.png', type: 'image/png', data: RNFetchBlob.wrap(image) },
        { name: 'token', data: token }
      ]).then((resp) => {
        resolve(resp)
      }).catch((error) => {
        resolve(error)
      });
    });

  }

  return {
    // a list of the API functions from step 2
    createAccount,
    checkCode,
    getNewCode,
    forgotPassword,
    changePassword,
    editProfile,
    uploadAvatar,
  }
}

// let's return back our create method as the default.
export default { create }

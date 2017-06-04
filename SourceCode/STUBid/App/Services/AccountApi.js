// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'

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
  //  const { token, firstName, lastName, phoneNumber, email } = info;
    return api.patch('Accounts/updateProfile', {
      token: info.token, firstName: info.firstName,
      lastName: info.lastName, phoneNumber: info.phoneNumber, email: info.email 
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
  }
}

// let's return back our create method as the default.
export default { create }

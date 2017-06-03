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
    return api.post('Accounts/register', { info });
  }

  const checkCode = (code, email, username, phoneNumber) => {
    return api.post('Accounts/register', { verifyCode: code, email, username, phoneNumber });
  }

  const getNewCode = (email, username, phoneNumber) => {
    //return api.post('Accounts/register', { verifyCode: code, email, username, phoneNumber });
  }

  const forgotPassword = (email) => {
    //return api.post('Accounts/register', { verifyCode: code, email, username, phoneNumber });
  }

  return {
    // a list of the API functions from step 2
    createAccount,
    checkCode,
    getNewCode,
  }
}

// let's return back our create method as the default.
export default { create }

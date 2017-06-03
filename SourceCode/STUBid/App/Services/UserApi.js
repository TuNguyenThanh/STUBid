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

  // Force OpenWeather API Key on all requests
  api.addRequestTransform(request => {});

  if (__DEV__ && console.tron) {
    console.tron.log('Hello, I\'m an example of how to log via Reactotron.')
    api.addMonitor(console.tron.apisauce)
  };

  // get state working of pro
  // const getAuction = (page) => api.get('Auctions/page/' + page);

  const login = (username, password) => {
    return api.post('Accounts/login', { username, password });
  }

  const loginToken = (token) => {
    return api.post('Accounts/login', { token });
  }

  return {
    // a list of the API functions from step 2
    login,
    loginToken
  }
}

// let's return back our create method as the default.
export default { create }

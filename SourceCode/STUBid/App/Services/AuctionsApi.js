// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'
import IO from 'socket.io-client/dist/socket.io'

const create = (baseURL = ApiConfig.baseURL) => {
  const headers = ApiConfig.headers;
  const socket = IO(ApiConfig.baseURL);
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

  const getAuction = (page) => {
    return new Promise(resolve => {
      socket.on('SERVER-SEND-AUCTIONS', (data) => {
        resolve(data);
      });
    });
  }

  return {
    // a list of the API functions from step 2
    getAuction
  }
}

// let's return back our create method as the default.
export default { create }

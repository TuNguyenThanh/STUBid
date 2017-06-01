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

  // get state working of pro
  // const getAuction = (page) => api.get('Auctions/page/' + page);

  const getAuction = (category, page) => {
    return new Promise(resolve => {
      socket.on('SERVER-SEND-AUCTIONS', (data) => {
        resolve(data);
      });
    });
  }

  const bidProduct = (auctionId, accountId, price) => {
    return api.patch('Auctions/bid', {
      auctionId, accountId, price
    });
  }

  return {
    // a list of the API functions from step 2
    getAuction,
    bidProduct
  }
}

// let's return back our create method as the default.
export default { create }

const baseURL = 'https://sbid.herokuapp.com/api/';
const baseSocketIOURL = 'https://sbid.herokuapp.com/';

// const baseURL = 'http://192.168.1.175:3000/api/';
// const baseSocketIOURL = 'http://192.168.1.175:3000/';

// const baseURL = 'http://localhost:3000/api/';
// const baseSocketIOURL = 'http://localhost:3000/';

const headers = {
  "App-Name": "sbid"
};

const timeOut = 30000;

export default {
  baseURL,
  baseSocketIOURL,
  timeOut,
  headers,
}

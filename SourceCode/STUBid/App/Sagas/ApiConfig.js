const baseURL = 'http://198.100.145.58:1343/';
// const hostURL = 'http://ucom2b.com/'
// const masterKey = 'hceTtnA'
const appId = 'AT_OnzavApp'
const masterKey = 'hceTtnA'

const headers = {
	'X-Parse-Application-Id' : 'AT_OnzavApp',
	'Content-Type' : 'application/json',
    'Cache-Control': 'no-cache',
    'X-Parse-Master-Key' : 'hceTtnA',
}

 const timeOut = 30000 // 30 second

 export default {
  baseURL,
  timeOut,
  headers,
  appId,
  // masterKey,
}

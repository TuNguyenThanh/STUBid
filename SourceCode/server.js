var config = require('./config');

// http request configuration
var url = require('url');
var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(function(req, res, next) {
    console.log(req.header('origin'));
    let url_parts = url.parse(req.url);
    let pathname = url_parts.pathname;
    if ((new RegExp(/^\/api\/\w+/).test(pathname) &&
            req.header('App-Name') && req.header('App-Name') !== 'sbid'))
        return res.status(404).send();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
var server = require('http').createServer(app);
server.listen(config.PORT, () => {
    console.log('Server is running');
});

app.get('/api/Auctions/:auctionId', require('./controllers/auction/getAuction'));
app.patch('/api/Auctions/active/:auctionId', require('./controllers/auction/active'));
app.get('/api/Auctions/page/:page', require('./controllers/auction/getAuctions'));
app.get('/api/Auctions/category/:categoryId/page/:page', require('./controllers/auction/getAuctionsByCategory'));
app.post('/api/Auctions/uploadProduct', require('./controllers/auction/postAuction'));
app.patch('/api/Auctions/bid', (req, res) => require('./controllers/auction/bid')(req, res));
app.get('/api/Auctions/myUnactivatedAuctions/:token', require('./controllers/auction/getMyUnactivatedAuctions'));
app.post('/api/Auctions/closeOrDelete', require('./controllers/auction/closeOrDelete'));
app.patch('/api/Auctions/:auctionId', require('./controllers/auction/update'));

app.post('/api/Accounts/register', require('./controllers/account/register'));
app.post('/api/Accounts/resendVerifyCode', require('./controllers/account/resendVerifyCode'));
app.post('/api/Accounts/login', require('./controllers/account/login'));
app.post('/api/Accounts/forgotPassword', require('./controllers/account/forgotPassword'));
app.patch('/api/Accounts/resetPassword', require('./controllers/account/resetPassword'));
app.patch('/api/Accounts/changePassword', require('./controllers/account/changePassword'));
app.patch('/api/Accounts/updateProfile', require('./controllers/account/updateProfile'));
app.patch('/api/Accounts/updateAvatar', require('./controllers/account/updateAvatar'));

app.patch('/api/Products/:productId', require('./controllers/product/update'));

app.get('/api/BidHistorys/auctionId/:auctionId', require('./controllers/bidHistory/getByAuction'));

app.get('/api/BankBrands', require('./controllers/bank/getBankBrands'));

app.get('/api/UserLevels', require('./controllers/userLevel/getUserLevels'));

app.get('/api/Categorys', require('./controllers/category/getCategory'));
app.get('/api/guide/:usage', require('./controllers/webview/getGuide'));
app.get('/api/guide', require('./controllers/webview/getGuide'));
app.get('/api/files/:fileName', (req, res) => {
    res.sendFile(__dirname + '/public/files/' + req.params.fileName)
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

// socket.io configuration
var io = require('socket.io')(server);
io.on('connection', require('./helpers/socket').connect);
var config = require('./config');
var { getAuctions } = require('./models/auction');
var { getCategorys } = require('./models/category');

// http request configuration
var url = require('url');
var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(function (req, res, next) {
  console.log(req.header('origin'));
  let url_parts = url.parse(req.url),
      pathname = url_parts.pathname;
  if ((new RegExp(/^\/api\/\w+/).test(pathname)
      && req.header('App-Name') !== 'sbid'))
    return res.status(404).send();

  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
var server = require('http').createServer(app);
server.listen(config.PORT, () => {
  console.log('Server is running');
});

app.get('/api/Auctions/page/:page', require('./controllers/getAuctions'));
app.get('/api/Auctions/category/:categoryId/page/:page', require('./controllers/getAuctionsByCategory'));
app.post('/api/Auctions/uploadProduct', require('./controllers/postAuction'));
app.patch('/api/Auctions/bid', (req,res) => require('./controllers/bid')(req, res, sockets));
app.get('/api/Categorys', (req,res) => res.send({ ok: true, result: getCategorys() }));
app.post('/api/Accounts/register', require('./controllers/register'));
app.post('/api/Accounts/resendVerifyCode', require('./controllers/resendVerifyCode'));
app.post('/api/Accounts/login', require('./controllers/login'));
app.post('/api/Accounts/forgotPassword', require('./controllers/forgotPassword'));
app.get('/Accounts/resetPassword', require('./controllers/resetPassword'));
app.patch('/api/Accounts/changePassword', require('./controllers/changePassword'));
app.patch('/api/Accounts/updateProfile', require('./controllers/updateProfile'));
app.patch('/api/Accounts/updateAvatar', require('./controllers/updateAvatar'));
app.get('/api/BankBrands', require('./controllers/getBankBrands'));

app.get('/api', (req,res) => { res.sendFile(__dirname + '/public/index.html') });
app.get('/guide', require('./controllers/getGuide'));

// socket.io configuration
var io = require('socket.io')(server),
    sockets = [];
let interval = setInterval(() => {
  sockets.forEach(socket => {
    socket.emit('SERVER-SEND-AUCTIONS', getAuctions(socket.page - 1, socket.categoryId));
  })
}, 1000);

io.on('connection', function (socket) {
  if (
    socket.handshake.query.appName === 'sbid'
    || new RegExp(socket.handshake.headers.origin).test(config.ALLOW_ORIGIN) === true
  ) {
    socket.page = 1;
    socket.categoryId = -1;
    sockets.push(socket);
  }
  else {
    socket.disconnect();
    console.log('disconnect due to handshake failed');
  }

  socket.emit('SERVER-SEND-INFO', { page: socket.page, categoryId: socket.categoryId })

  socket.on('CLIENT-SEND-PAGE', data => {
    console.log(data);
    socket.page = data.page;
  });

  socket.on('CLIENT-SEND-CATEGORY', data => {
    console.log(data);
    socket.page = 1;
    socket.categoryId = data.categoryId;
  });

  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket),1);
    console.log('disconnect');
  });
});
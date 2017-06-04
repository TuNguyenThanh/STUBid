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
  if (pathname != '/'
    && pathname != '/Accounts/resetPassword'
    && req.header('App-Name') != 'sbid'
    && (!req.header('origin')
      || new RegExp(req.header('origin')).test(config.ALLOW_ORIGIN) != true)
  )
    return res.send({
        ok: false,
        error: {
          code: 97,
          description: 'you do not have permission to access this route'
        }
    });

  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var server = require('http').createServer(app);
server.listen(config.PORT, () => {
  console.log('Server is running');
});

app.get('/', (req,res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/Auctions/page/:page', require('./controllers/getAuctions'));
app.get('/Auctions/category/:categoryId/page/:page', require('./controllers/getAuctionsByCategory'));
app.post('/Auctions', require('./controllers/postAuction'));
app.patch('/Auctions/bid', (req,res) => require('./controllers/bid')(req, res, sockets));
app.get('/Categorys', (req,res) => res.send({ ok: true, result: getCategorys() }));
app.post('/Accounts/register', require('./controllers/register'));
app.post('/Accounts/resendVerifyCode', require('./controllers/resendVerifyCode'));
app.post('/Accounts/login', require('./controllers/login'));
app.post('/Accounts/forgotPassword', require('./controllers/forgotPassword'));
app.get('/Accounts/resetPassword', require('./controllers/resetPassword'));
app.patch('/Accounts/changePassword', require('./controllers/changePassword'));

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
    socket.handshake.query.key === 'sbid'
    || new RegExp(socket.handshake.headers.origin).test(config.ALLOW_ORIGIN) === true
  ) {
    socket.page = 1;
    socket.categoryId = -1;
    sockets.push(socket);
  }
  else socket.disconnect();

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

  socket.on('disconnect', () => sockets.splice(sockets.indexOf(socket),1));
});
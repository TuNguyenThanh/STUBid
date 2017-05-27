var config = require('./config');
var { getAuctions } = require('./models/auction');
var { getCategorys } = require('./models/category');

// http request configuration
var express = require('express');
var app = express();
app.use(express.static('public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var server = require('http').createServer(app);
server.listen(config.PORT, () => {
  console.log('Server is running');
  Object.keys(config).forEach(key => {
    console.log(key + ' : ' + config[key]);
  })
});

// app.get('/Auctions', require('./controllers/getAuctions'));
app.get('/Auctions/page/:page', require('./controllers/getAuctions'));
app.get('/Auctions/category/:categoryId/page/:page', require('./controllers/getAuctionsByCategory'));
app.patch('/Auctions/bid', (req,res) => require('./controllers/bid')(req, res, sockets));
app.post('/Auctions', require('./controllers/postAuction'));
app.get('/Categorys', (req,res) => res.send({ ok: true, result: getCategorys() }));
app.post('/Accounts/login', require('./controllers/login'));
app.get('/Accounts/bankRefs', require('./controllers/getBankRefs'));

// socket.io configuration
var io = require('socket.io')(server),
    sockets = [];
let interval = setInterval(() => {
  sockets.forEach(socket => {
    socket.emit('SERVER-SEND-AUCTIONS', getAuctions(socket.page - 1, socket.categoryId));
  })
}, 1000);
io.on('connection', function (socket) {
  socket.page = 1;
  socket.categoryId = -1;
  sockets.push(socket);

  socket.on('CLIENT-SEND-PAGE', page => {
    socket.page = page;
  });

  socket.on('CLIENT-SEND-CATEGORY', categoryId => {
    socket.page = 1;
    socket.categoryId = categoryId;
    console.log(socket.categoryId);
  });

  socket.on('disconnect', () => sockets.splice(sockets.indexOf(socket),1));
});
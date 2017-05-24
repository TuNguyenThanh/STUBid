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
app.post('/Auctions', require('./controllers/postAuction'));
app.get('/Categorys', (req,res) => res.send(getCategorys()));
app.post('/Accounts/login', require('./controllers/login'));
app.get('/Accounts/bankRefs', require('./controllers/getBankRefs'));

// socket.io configuration
var io = require('socket.io')(server),
    sockets = [];
// let interval = setInterval(() => io.emit('SERVER-SEND-AUCTIONS', auction.getAuctions()), 1000);
let interval = setInterval(() => {
  sockets.forEach(socket => {
    let page = socket.page,
        auctions = [];
    for (var i = 0; i < page; i++) {
      auctions = auctions.concat(getAuctions(i))
    }
    socket.emit('SERVER-SEND-AUCTIONS', auctions);
  })
}, 1000);
io.on('connection', function (socket) {
  socket.page = 1;
  sockets.push(socket);

  socket.on('CLIENT-SEND-PAGE', page => {
    socket.page = page;
    console.log(socket.page);
  });
});
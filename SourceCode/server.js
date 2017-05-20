var config = require('./config');
var auction = require('./models/auction');
auction.loadAuctions();
var category = require('./models/category');
category.loadCategorys();

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

app.get('/Auctions', (req,res) => res.send(auction.getAuctions()));
app.get('/Categorys', (req,res) => res.send(category.getCategorys()));
app.post('/Accounts/login', require('./controllers/login'));

// socket.io configuration
var io = require('socket.io')(server);
let interval = setInterval(() => io.emit('SERVER-SEND-AUCTIONS', auction.getAuctions()), 1000);
io.on('connection', function (socket) {
  
});
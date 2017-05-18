var config = require('./config');
var auction = require('./models/auction');
auction.loadAuctions();

// http request configuration
var express = require('express');
var app = express();
app.use(express.static('public'));
var server = require('http').createServer(app);
server.listen(config.PORT, () => {
  console.log('Server is running');
  Object.keys(config).forEach(key => {
    console.log(key + ' : ' + config[key]);
  })
});

app.get('/Auctions', (req,res) => res.send(auction.getAuctions()))

// socket.io configuration
var io = require('socket.io')(server);
let interval = setInterval(() => io.emit('SERVER-SEND-AUCTIONS', auction.getAuctions()), 1000);
io.on('connection', function (socket) {
  
});
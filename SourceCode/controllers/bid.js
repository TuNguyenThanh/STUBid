var { bid } = require('../models/auction');

module.exports = (req, res, sockets) => {
    var { auctionId, accountId, price } = req.body;
    bid(auctionId, accountId, price)
    .then(result => {
        sockets.forEach(socket => {
            if (socket.page >= result.page)
                socket.emit('SERVER-UPDATE-AUCTION', result.accountIdauction);
        })
        res.send({
            ok: true
        })
    })
    .catch(error => {
        console.log(error);
        res.send({
            ok: false,
            error: error
        })
    })
}
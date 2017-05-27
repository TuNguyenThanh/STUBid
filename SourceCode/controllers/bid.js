var { bid } = require('../models/auction');

module.exports = (req, res, sockets) => {
    var { auctionId, accountId, price } = req.body;
    bid(auctionId, accountId, price)
    .then(result => {
        sockets.forEach(socket => {
            if (
                (socket.categoryId == -1 && socket.page >= result.page)
                || (socket.categoryId == result.categoryId && socket.page >= result.pageInCategory)
            )
                socket.emit('SERVER-UPDATE-AUCTION', result.auction);
        })
        res.send()
    })
    .catch(error => {
        console.log(error);
        res.send({
            error: error
        })
    })
}
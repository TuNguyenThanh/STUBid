const { verify, refreshToken } = require('../helpers/jwt'),
      { bid } = require('../models/auction');

module.exports = (req, res, sockets) => {
    var { token, auctionId, accountId, price } = req.body;
    if (!token || !auctionId || !accountId || !price)
        return res.send({
            success: false,
            error: 'missing parameters'
        });
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject(new Error('authentication failed'));
        token = refreshToken(obj);
        return bid(auctionId, accountId, price)
    })
    .then(result => {
        sockets.forEach(socket => {
            socket.emit('SERVER-SEND-AUCTIONS', getAuctions(socket.page - 1, socket.categoryId));
        })
        res.send({ success: true, token })
    })
    .catch(error => {
        console.log(error);
        res.send({
            success: false,
            error: error + ''
        })
    })
}
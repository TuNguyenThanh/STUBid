const { verify, refreshToken } = require('../../helpers/jwt'),
      { bid, getAuctions } = require('../../models/auction');

module.exports = (req, res, sockets) => {
    var { token, auctionId, accountId, price } = req.body;
    if (!token || !auctionId || !accountId || !price)
        return res.status(400).send({
            success: false,
            error: ERROR[400][0]
        })
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject({
            success: false,
            error: ERROR[400][1]
        });
        token = refreshToken(obj);
        return bid(auctionId, accountId, price)
    })
    .then(result => {
        sockets.forEach(socket => {
            socket.emit('SERVER-SEND-AUCTIONS', getAuctions(socket.page - 1, socket.categoryId));
        })
        res.send({ success: true, token })
    })
    .catch(reason => {
        console.log(reason);
        res.status(reason.status).send({
            success: false,
            error: reason.error
        })
    })
}
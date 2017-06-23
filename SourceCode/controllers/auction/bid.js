const { verify, refreshToken } = require('../../helpers/jwt');
const { bid, getAuctions } = require('../../models/auction');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
    var { token, auctionId, accountId, price, buyNow } = req.body;
    if (!token || !auctionId || !accountId || !price)
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            });
        token = refreshToken(obj);
        return bid(auctionId, accountId, price, buyNow?buyNow:false)
    })
    .then(result => {
        // sockets.forEach(socket => {
        //     socket.emit('SERVER-SEND-AUCTIONS', getAuctions(socket.page - 1, socket.categoryId));
        // })
        res.send({ success: true, token })
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        })
    })
}
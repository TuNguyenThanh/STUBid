const { verify, refreshToken } = require('../../helpers/jwt');
const { buyNow, getAuctions } = require('../../models/auction');
const ERROR = require('../../error.json');

module.exports = (req, res, sockets) => {
    var { token, auctionId } = req.body;
    if (!token || !auctionId)
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
        return buyNow(obj.accountId, auctionId)
    })
    .then(() => {
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
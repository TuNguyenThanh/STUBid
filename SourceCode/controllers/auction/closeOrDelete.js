const { verify, refreshToken } = require('../../helpers/jwt');
const { closeAuction } = require('../../models/auction');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
    var { token, auctionId } = req.body;
    if (!token || !auctionId)
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
        return closeAuction(auctionId, obj.accountId)
    })
    .then(result => {
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
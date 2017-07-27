const { verify, refreshToken } = require('../../helpers/jwt');
const { closeAuction } = require('../../models/auction');
const { sendUnactivated } = require('../../helpers/socket');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
    var { token, auctionId } = req.body;
    if (!token || !auctionId)
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    verify(token)
    .then(({object, sessionId}) => {
        if (!object.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            });
        token = refreshToken(object, sessionId);
        return closeAuction(auctionId, object.accountId, object.isAdmin)
    })
    .then((sellerAccountId) => {
        res.send({ success: true, token });
        if (sellerAccountId) sendUnactivated(sellerAccountId);
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        })
    })
}
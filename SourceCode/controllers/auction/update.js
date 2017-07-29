const {
    updateAuction
} = require('../../models/auction');
const {
    verify,
    refreshToken
} = require('../../helpers/jwt');
const { sendUnactivated } = require('../../helpers/socket');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
    let auctionId = req.params.auctionId;
    let {
        token,
        auction
    } = req.body;
    if (!auctionId || !token || !auction) {
        return res.send({
            success: false,
            error: ERROR[400][0]
        });
    }
    verify(token)
        .then(({
            object,
            sessionId
        }) => {
            if (!object.accountId) {
                return Promise.reject({
                    status: 400,
                    error: ERROR[400][1]
                });
            }
            this.accountId = object.accountId;
            token = refreshToken(object, sessionId);
            return updateAuction(auctionId, auction, object.accountId, object.isAdmin);
        })
        .then(() => {
            res.send({
                success: true,
                token
            });
            sendUnactivated(this.accountId);
        })
        .catch((reason) => {
            res.send({
                success: false,
                error: reason.error
            });
        })
}
const AUCTION = require('../../models/auction');
const JWT = require('../../helpers/jwt');
const SOCKET = require('../../helpers/socket');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  let auctionId = req.params.auctionId;
  let {
    token,
    auction,
    sellerAccountId
  } = req.body;
  if (!auctionId || !token || !auction) {
    return res.send({
      success: false,
      error: ERROR[400][0]
    });
  }
  JWT.verify(token)
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
      this.object = object;
      this.sessionId = sessionId;
      return AUCTION.updateAuction(auctionId, auction, object.accountId, object.isAdmin);
    })
    .then(() => {
      res.send({
        success: true,
        token: JWT.refreshToken(this.object, this.sessionId)
      });
      if (sellerAccountId) SOCKET.sendUnactivated(sellerAccountId);
    })
    .catch((reason) => {
      res.send({
        success: false,
        error: reason.error
      });
    })
}
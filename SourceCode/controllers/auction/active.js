const JWT = require('../../helpers/jwt');
const AUCTION = require('../../models/auction');
const SOCKET = require('../../helpers/socket');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  let auctionId = req.params.auctionId;
  var {
    token
  } = req.body;
  if (!token || !auctionId)
    return res.send({
      success: false,
      error: ERROR[400][0]
    })
  JWT.verify(token)
    .then(({
      object,
      sessionId
    }) => {
      if (!object.accountId || !object.isAdmin)
        return Promise.reject({
          status: 400,
          error: ERROR[400][1]
        });
      this.object = object;
      this.sessionId = sessionId;
      return AUCTION.active(auctionId, object.accountId);
    })
    .then((sellerAccountId) => {
      res.send({
        success: true,
        token: JWT.refreshToken(this.object, this.sessionId)
      });
      if (sellerAccountId) SOCKET.sendUnactivated(sellerAccountId);
    })
    .catch(reason => {
      console.log(reason);
      res.send({
        success: false,
        error: reason.error
      })
    })
}
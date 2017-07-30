const JWT = require('../../helpers/jwt');
const BID_HISTORY = require('../../models/bidHistory');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  var {
    token,
    auctionId,
    accountId,
    price,
    buyNow
  } = req.body;
  if (!token || !auctionId || !accountId || !price)
    return res.send({
      success: false,
      error: ERROR[400][0]
    })
  JWT.verify(token)
    .then(({
      object,
      sessionId
    }) => {
      if (!object.accountId)
        return Promise.reject({
          status: 400,
          error: ERROR[400][1]
        });
      this.object = object;
      this.sessionId = sessionId;
      return BID_HISTORY.insert(auctionId, accountId, price, buyNow ? buyNow : false)
    })
    .then((result) => {
      res.send({
        success: true,
        token: JWT.refreshToken(this.object, this.sessionId)
      })
    })
    .catch((reason) => {
      console.log(reason);
      res.send({
        success: false,
        error: reason.error
      })
    })
}
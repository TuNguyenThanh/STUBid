const { updateAuction } = require('../../models/auction');
const { verify, refreshToken } = require('../../helpers/jwt');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  let auctionId = req.params.auctionId;
  let { token, auction } = req.body;
  if (!auctionId || !token || !auction) {
    return res.send({
      success: false,
      error: ERROR[400][0]
    });
  }
  verify(token)
    .then((obj) => {
      if (!obj.accountId) {
        return Promise.reject({
          status: 400,
          error: ERROR[400][1]
        });
      }
      token = refreshToken(obj);
      return updateAuction(auctionId, auction, obj.accountId, obj.isAdmin);
    })
    .then(() => {
      res.send({
        success: true,
        token
      });
    })
    .catch((reason) => {
      res.send({
        success: false,
        error: reason.error
      });
    })
}
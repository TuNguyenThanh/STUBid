const PRODUCT = require('../../models/product');
const JWT = require('../../helpers/jwt');
const SOCKET = require('../../helpers/socket');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  let productId = req.params.productId;
  let {
    token,
    product,
    sellerAccountId
  } = req.body;
  if (!productId || !token || !product) {
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
      return PRODUCT.update(productId, product);
    })
    .then(() => {
      res.send({
        success: true,
        token: JWT.refreshToken(object, sessionId)
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
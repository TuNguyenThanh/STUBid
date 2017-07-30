const PRODUCT = require('../../models/product');

module.exports = (req, res) => {
  let productId = req.params.productId;
  PRODUCT.get(productId)
    .then((result) => {
      res.send({
        success: true,
        result
      })
    })
    .catch(reason => {
      console.log(reason);
      res.send({
        success: false,
        error: reason.error
      })
    })
}
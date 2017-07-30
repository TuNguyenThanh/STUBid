const PRODUCT = require('../../models/product');

module.exports = (req, res) => {
  let productIds = req.query.productIds;
  productIds = JSON.parse(productIds);
  PRODUCT.getAll(productIds)
    .then((results) => {
      res.send({
        success: true,
        results
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
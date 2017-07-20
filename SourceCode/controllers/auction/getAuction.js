var { getAuction } = require('../../models/auction');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  let auctionId = req.params.auctionId;
  if (!auctionId) {
    return res.send({
      success: false,
      error: ERROR[400][0]
    })
  }
  getAuction(parseInt(auctionId))
    .then(auction => {
      res.send({
        success: true,
        result: auction
      })
    })
    .catch(reason => {
      console.log(reason);
      res.send({
        success: false,
        error: reason.error
      })
    });
}
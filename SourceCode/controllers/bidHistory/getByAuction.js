const { getByAuction } = require('../../models/bidHistory');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  const auctionId = req.params.auctionId;
  if (!auctionId) {
    return res.send({
      success: false,
      error: ERROR[400][0]
    });
  }

  getByAuction(auctionId)
    .then((value) => {
      return res.send({
        success: true,
        result: value
      });
    })
    .catch((reason) => {
      console.log(reason);
      return res.send({
        success: false,
        error: reason.error
      })
    })
}
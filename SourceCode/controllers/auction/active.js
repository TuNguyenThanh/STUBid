const { verify, refreshToken } = require('../../helpers/jwt');
const { active } = require('../../models/auction');
const ERROR = require('../../error.json');

module.exports = (req, res) => {
  let auctionId = req.params.auctionId;
  var { token } = req.body;
  if (!token || !auctionId)
    return res.send({
      success: false,
      error: ERROR[400][0]
    })
  verify(token)
    .then(obj => {
      if (!obj.accountId || !obj.isAdmin)
        return Promise.reject({
          status: 400,
          error: ERROR[400][1]
        });
      token = refreshToken(obj);
      return active(auctionId)
    })
    .then(result => {
      // sockets.forEach(socket => {
      //     socket.emit('SERVER-SEND-AUCTIONS', selectAuctions(socket.page - 1, socket.categoryId));
      // })
      res.send({ success: true, token })
    })
    .catch(reason => {
      console.log(reason);
      res.send({
        success: false,
        error: reason.error
      })
    })
}
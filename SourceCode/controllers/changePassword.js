const { verify, refreshToken } = require('../helpers/jwt'),
      { changePassword } = require('../models/account'),
      ERROR = require('../error.json');

module.exports = (req,res) => {
    var { token, currentPassword, newPassword } = req.body;
    if (!token || !currentPassword || !newPassword) {
        return res.status(400).send({
            success: false,
            error: ERROR[400][0]
        })
    }
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            });
        token = refreshToken(obj);
        return changePassword(obj.accountId, currentPassword, newPassword);
    })
    .then(() => {
        res.send({ success: true });
    })
    .catch(reason => {
        console.log(reason);
        res.status(reason.status).send({
            success: false,
            error: reason.error
        });
    })
}
const { verify, refreshToken } = require('../helpers/jwt'),
      { changePassword } = require('../models/account');

module.exports = (req,res) => {
    var { token, currentPassword, newPassword } = req.body;
    if (!token || !currentPassword || !newPassword) {
        return res.send({
            success: false,
            error: 'missing parameters'
        })
    }
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject(new Error('authentication failed'));
        token = refreshToken(obj);
        return changePassword(obj.accountId, currentPassword, newPassword);
    })
    .then(() => {
        res.send({ success: true });
    })
    .catch(error => {
        console.log(error);
        res.send({
            success: false,
            error: error + ''
        });
    })
}
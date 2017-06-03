const { verify } = require('../helpers/jwt'),
      { resetPassword } = require('../models/account');

module.exports = (req,res) => {
    var { verifyToken } = req.query;
    if (!verifyToken) {
        return res.send({
            ok: false,
            error: 'verification token is required'
        })
    }
    verify(verifyToken)
    .then(object => {
        if (!object.accountId)
            return Promise.reject(new Error('verification token is invalid'))
        return resetPassword(object.accountId)
    })
    .then(newPassword => {
        res.send('your new password is: ' + newPassword);
    })
    .catch(error => {
        console.log(error);
        res.send({
            ok: false,
            error: error + ''
        })
    })
}
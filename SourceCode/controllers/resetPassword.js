const { verify } = require('../helpers/jwt'),
      { resetPassword } = require('../models/account'),
      ERROR = require('../error.json');

module.exports = (req,res) => {
    var { verifyToken } = req.query;
    if (!verifyToken) {
        return res.status(400).send({
            ok: false,
            error: ERROR[400][0]
        })
    }
    verify(verifyToken)
    .then(object => {
        if (!object.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            })
        return resetPassword(object.accountId)
    })
    .then(newPassword => {
        res.send('your new password is: ' + newPassword);
    })
    .catch(reason => {
        console.log(reason);
        res.status(reason.status).send({
            ok: false,
            error: reason.error
        })
    })
}
const { verify, refreshToken } = require('../../helpers/jwt'),
      { changePassword } = require('../../models/account'),
      ERROR = require('../../error.json');

module.exports = (req,res) => {
    var { token, currentPassword, newPassword } = req.body;
    if (!token || !currentPassword || !newPassword) {
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    }
    verify(token)
    .then(({object, sessionId}) => {
        if (!object.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            });
        token = refreshToken(object, sessionId);
        return changePassword(object.accountId, currentPassword, newPassword);
    })
    .then(() => {
        res.send({
            success: true,
            token
        });
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        });
    })
}
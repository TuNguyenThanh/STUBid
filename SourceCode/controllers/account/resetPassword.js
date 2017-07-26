const { verify, removeToken } = require('../../helpers/jwt'),
      { resetPassword } = require('../../models/account'),
      ERROR = require('../../error.json');

module.exports = (req,res) => {
    let { token } = req.body;
    if (!token) {
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    }
    verify(token)
    .then(({object, sessionId}) => {
        console.log(!object.accountId || !sessionId);
        if (!object.accountId || !sessionId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            })
        this.sessionId = sessionId;
        console.log(this.sessionId);
        return resetPassword(object.accountId)
    })
    .then(result => {
        res.send(Object.assign({
            success: true,  
        }, result));
        removeToken(this.sessionId);
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        })
    })
}
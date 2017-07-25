const { verify } = require('../../helpers/jwt'),
      { resetPassword } = require('../../models/account'),
      ERROR = require('../../error.json');

module.exports = (req,res) => {
    var { token } = req.body;
    if (!token) {
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    }
    verify(token)
    .then(object => {
        if (!object.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            })
        return resetPassword(object.accountId)
    })
    .then(result => {
        res.send(Object.assign({
            success: true,  
        }, result));
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        })
    })
}
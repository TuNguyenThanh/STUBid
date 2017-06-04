const { verify } = require('../helpers/jwt'),
      { changePassword } = require('../models/account');

module.exports = (req,res) => {
    var { token, currentPassword, newPassword } = req.body;
    console.log({ token, currentPassword, newPassword });
    if (!token || !currentPassword || !newPassword) {
        return res.send({
            success: false,
            error: 'missing parameters'
        })
    }
    verify(token)
    .then(object => {
        console.log(new Date(object.exp*1000));
        console.log(new Date(Date.now()));
        if (object.exp*1000 < Date.now())
            return Promise.reject(new Error('token is expired'));
        if (!object.accountId)
            return Promise.reject(new Error('token is invalid'));
        console.log(object);
        return changePassword(object.accountId, currentPassword, newPassword);
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
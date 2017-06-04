const { verify, refreshToken } = require('../helpers/jwt'),
      { updateProfile } = require('../models/account');

module.exports = (req,res) => {
    var { token, firstName, lastName, phoneNumber, email } = req.body;
    if (!token || !firstName || !lastName || !phoneNumber || !email)
        return res.send({
            success: false,
            error: 'missing parameters'
        });
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject(new Error('authentication failed'));
        token = refreshToken(obj);
        return updateProfile(obj.accountId, firstName, lastName, phoneNumber, email)
    })
    .then(() => {
        res.send({ success: true, token });
    })
    .catch(error => {
        console.log(error);
        res.send({
            success: false,
            error: error + ''
        });
    })
}
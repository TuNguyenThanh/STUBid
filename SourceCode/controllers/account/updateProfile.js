const { verify, refreshToken } = require('../../helpers/jwt'),
      { updateProfile } = require('../../models/account'),
      ERROR = require('../../error.json');

module.exports = (req,res) => {
    var { token, firstName, lastName, phoneNumber, email, bankRef } = req.body;
    if (!token || !firstName || !lastName || !phoneNumber || !email ||
    (bankRef === undefined) || (bankRef && bankRef.bankAccountNumber && !bankRef.bankBrandId))
        return res.status(400).send({
            success: false,
            error: ERROR[400][0]
        })
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][0]
            });
        token = refreshToken(obj);
        return updateProfile(obj.accountId, firstName, lastName, phoneNumber, email, bankRef)
    })
    .then(() => {
        res.send({ success: true, token });
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        });
    })
}
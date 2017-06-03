var { resetVerifyCode } = require('../models/account'),
    { sendSMS } = require('../helpers/sms');

module.exports = (req,res) => {
    var { phoneNumber, email, username } = req.body;
    if (!phoneNumber || !email || !username) {
        res.send({ error: 'missing parameters' })
    }
    else {
        let result = resetVerifyCode(phoneNumber, email, username);
        if (result.error)
            return res.send({ error: error + '' });
        sendSMS(phoneNumber, result.verifyCode)
        .then(() => res.send())
        .catch(error => res.send({ error: error + '' }))
    }
}
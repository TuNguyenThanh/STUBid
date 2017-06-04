var { resetVerifyCode } = require('../models/account'),
    { sendSMS } = require('../helpers/sms');

module.exports = (req,res) => {
    var { phoneNumber, email, username } = req.body;
    if (!phoneNumber || !email || !username) {
        res.send({ success: false, error: 'missing parameters' })
    }
    else {
        let result = resetVerifyCode(phoneNumber, email, username);
        if (result.error)
            return res.send({ success: false, error: error + '' });
        sendSMS(phoneNumber, result.verifyCode)
        .then(() => res.send({ success: true }))
        .catch(error => res.send({ success: false, error: error + '' }))
    }
}
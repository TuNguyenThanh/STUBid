const { resetVerifyCode } = require('../../models/account');
const { sendSMS } = require('../../helpers/sms');
const ERROR = require('../../error.json');

module.exports = (req,res) => {
    var { phoneNumber, email, username } = req.body;
    if (!phoneNumber || !email || !username) {
        res.status(400).send({
            success: false,
            error: ERROR[400][0]
        })
    }
    else {
        resetVerifyCode(phoneNumber, email, username)
        .then(verifyCode => {
            return sendSMS(phoneNumber, verifyCode)
        })
        .then(() => res.send({ success: true }))
        .catch(reason => {
            console.log(reason);
            res.status(reason.status).send({ success: false, error: reason.error })
        })
    }
}
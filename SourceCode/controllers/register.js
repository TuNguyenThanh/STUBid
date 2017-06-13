var { register, exist, pushRegisterQueue } = require('../models/account'),
    { sendSMS } = require('../helpers/sms'),
    ERROR = require('../error.json');

module.exports = (req,res) => {
    var { firstName, lastName, phoneNumber, email, username, password, verifyCode } = req.body;
    if (!verifyCode) {
        if (!firstName || !lastName || !phoneNumber || !email || !username || !password) {
            return res.status(400).send({
                success: false,
                error: ERROR[400][0]
            })
        }
        exist(username, email, phoneNumber)
        .then(() => {
            let code = pushRegisterQueue(firstName, lastName, phoneNumber, email, username, password)
            return sendSMS(phoneNumber, code);
        })
        .then(() => {
            res.send({
                ok: true,
                step: 1
            })
        })
        .catch(reason => {
            console.log(reason);
            res.status(reason.status).send({
                ok: false,
                error: reason.error
            })
        })
    }
    else {
        if (!phoneNumber || !email || !username) {
            return res.status(400).send({
                success: false,
                error: ERROR[400][0]
            })
        }
        register(verifyCode, phoneNumber, email, username)
        .then(() => {
            res.send({
                ok: true,
                step: 2
            })
        })
        .catch(reason => {
            console.log(reason);
            res.status(reason.status).send({
                ok: false,
                error: reason.error
            })
        })
    }
}
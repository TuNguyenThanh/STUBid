var { register, exist, pushRegisterQueue } = require('../models/account'),
    { sendSMS } = require('../helpers/sms');

module.exports = (req,res) => {
    var { firstName, lastName, phoneNumber, email, username, password, verifyCode } = req.body;
    if (!verifyCode) {
        if (!firstName || !lastName || !phoneNumber || !email || !username || !password) {
            res.send({ error: 'missing parameters' })
        }
        else
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
            .catch(error => {
                console.log(error);
                res.send({
                    ok: false,
                    error: error + ''
                })
            })
    }
    else {
        if (!phoneNumber || !email || !username) {
            return res.send({ error: 'missing parameters' })
        }
        register(verifyCode, phoneNumber, email, username)
        .then(() => {
            res.send({
                ok: true,
                step: 2
            })
        })
        .catch(error => {
            console.log(error);
            res.send({
                ok: false,
                error: error + ''
            })
        })
    }
}
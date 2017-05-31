var { register, exist } = require('../models/account');

module.exports = (req,res) => {
    var { username, email, phoneNumber } = req.body;
    exist(username, email, phoneNumber)
    .then(() => {
        res.send({
            ok: true
        })
    })
    .catch(error => {
        res.send({
            ok: false,
            error: error + ''
        })
    })
}
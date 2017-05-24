var { getBankRefs } = require('../models/account'),
    { verify } = require('../helpers/jwt');

module.exports = (req,res) => {
    var accountId = 2;
    getBankRefs(accountId)
    .then(result => {
        res.send(result.rows)
    })
    .catch(error => {
        res.send(error)
    })
}
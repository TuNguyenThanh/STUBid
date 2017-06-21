const { verify, refreshToken } = require('../../helpers/jwt');
const { getMyAuctions } = require('../../models/auction');
const ERROR = require('../../error.json');

module.exports = (req,res) => {
    var { token } = req.params;
    // let page = req.params.page?req.params.page:1;
    if (!token)
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    verify(token)
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject({
            success: false,
            error: ERROR[400][1]
        });
        token = refreshToken(obj);
        return getMyAuctions(obj.accountId)
    })
    .then(value => {
        res.send({
            success: true,
            myAuctions: value
        })
    })
    .catch(reason => {
        console.log(reason);
        return res.send({
            success: false,
            error: reason.error
        })
    })
}
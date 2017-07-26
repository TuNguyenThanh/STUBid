const { verify } = require('../../helpers/jwt');
const { getMyAuctions } = require('../../models/auction');

module.exports = (req,res) => {
    let { token } = req.params;
    if (!token)
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    verify(token)
    .then(({object, sessionId}) => {
        if (!object.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            });
        return getMyAuctions(object.accountId, [0])
    })
    .then(unactivatedAuctions => {
        res.send({
            success: true,
            results: unactivatedAuctions
        })
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        })
    })
}
const { getCategorys } = require('../../models/category');

module.exports = (req,res) => {
    getCategorys()
    .then(categorys => {
        res.send({
            ok: true,
            result
        })
    })
    .catch(reason => {
        res.status(reason.status).send({
            ok: false,
            error: reason.error
        })
    })
}
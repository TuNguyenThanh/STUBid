const { getCategorys } = require('../../models/category');

module.exports = (req,res) => {
    getCategorys()
    .then(categorys => {
        res.send({
            success: true,
            result
        })
    })
    .catch(reason => {
        res.send({
            success: false,
            error: reason.error
        })
    })
}
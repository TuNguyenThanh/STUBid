const { getBankBrands } = require('../../models/bankBrand');

module.exports = (req,res) => {
    getBankBrands()
    .then(result => {
        res.send({
            success: true,
            result
        })
    })
    .catch(error => {
        res.send({
            success: false,
            error: error + ''
        })
    })
}
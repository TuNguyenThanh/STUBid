const { getBankBrands } = require('../../models/bankBrand');

module.exports = (req,res) => {
    getBankBrands()
    .then(result => {
        res.send({
            success: true,
            result
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
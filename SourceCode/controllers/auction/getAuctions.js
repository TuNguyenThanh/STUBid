var { getAuctions } = require('../../models/auction');

module.exports = (req,res) => {
    let page = req.params.page?req.params.page:1;
    res.send({
        success: true,
        result: getAuctions(page-1, -1)
    })
}
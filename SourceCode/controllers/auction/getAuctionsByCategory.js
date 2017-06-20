var { getAuctions } = require('../../models/auction');

module.exports = (req,res) => {
    let page = req.params.page?req.params.page:1,
        categoryId = req.params.categoryId;
    res.send({
        ok: true,
        result: getAuctions(page-1, categoryId)
    })
}
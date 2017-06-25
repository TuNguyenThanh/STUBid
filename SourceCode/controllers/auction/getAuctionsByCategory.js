var { selectAuctions } = require('../../models/auction');

module.exports = (req,res) => {
    let page = req.params.page?req.params.page:1,
        categoryId = req.params.categoryId;
    res.send({
        success: true,
        result: selectAuctions(page-1, categoryId)
    })
}
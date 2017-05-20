var { getAuctions } = require('../models/auction');

module.exports = (req,res) => {
    let page = req.params.page;
    if (page != undefined)
        res.send({
            success: true,
            result: getAuctions(page-1)
        })
    else {
        res.send(res.send({
            success: false,
            error: {
                code: 104,
                description: 'page is required'
            }
        }))
    }
}
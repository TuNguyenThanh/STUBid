const { query } = require('../../helpers/db');
const ERROR = require('../../error.json');

module.exports = (req,res) => {
    let sql = `SELECT * FROM "GuideDocument"`;
    query(sql,[])
    .then(result => {
        let html = '';
        result.rows.forEach(function(element) {
            html += `<h1>${element.title}</h1>${element.content}`
        }, this);
        res.send({
            success: true,
            html
        })
    })
    .catch(reason => {
        res.status(500).send({
            success: false,
            error: reason.error
        })
    })
}
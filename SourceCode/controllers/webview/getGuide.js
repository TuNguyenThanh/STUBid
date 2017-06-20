const { query } = require('../../helpers/db');
const ERROR = require('../../error.json');

module.exports = (req,res) => {
    let { usage } = req.params;
    let sql = `SELECT * FROM "GuideDocument" ${usage?`WHERE usage=$1`:''}`;
    query(sql,usage?[usage]:[])
    .then(result => {
        if (usage) {
            res.send({
                success: true,
                html: result.rows[0]?result.rows[0].content:''
            })
        }
        else {
            let html = '';
            result.rows.forEach(function(element) {
                html += element.content
            }, this);
            res.send({
                success: true,
                html
            })
        }
    })
    .catch(reason => {
        res.status(500).send({
            success: false,
            error: reason.error
        })
    })
}
const fs = require('fs');
const ERROR = require('../../error.json');
const { DIRNAME } = require('../../config');

module.exports = (req,res) => {
    fs.readFile(DIRNAME + '/public/guide.html', "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                success: false,
                error: ERROR[500][2]
            })
        }
        else {
            res.send({
                success: true,
                html: data
            })
        }
    })
}
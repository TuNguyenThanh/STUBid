const {
    getUserLevels
} = require('../../models/userLevel');

module.exports = (req, res) => {
    getUserLevels()
        .then(results => {
            res.send({
                success: true,
                results
            })
        })
        .catch(reason => {
            res.send({
                success: false,
                error: reason.error
            })
        })
}
var {
    query
} = require('../helpers/db');

exports.getUserLevels = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM "UserLevel" ORDER BY "userLevelId" ASC`;
        query(sql, [])
            .then(result => resolve(result.rows))
            .catch(error => reject(error));
    })
}
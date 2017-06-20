var { query } = require('../helpers/db');

exports.getCategorys = () => {
    new Promise((resolve,reject) => {
        let sql = `SELECT * FROM "Category" ORDER BY "categoryId" ASC`;
        query(sql,[])
        .then(result => resolve(result.rows))
        .catch(error => reject(error));
    })
}
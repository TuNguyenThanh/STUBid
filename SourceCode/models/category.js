var { query } = require('../helpers/db');
var categorys = [];

exports.loadCategorys = () => {
    let sql = `SELECT * FROM "Category"`;
    query(sql,[])
    .then(result => {
        categorys = result.rows;
        console.log('load ' + result.rowCount + ' categories');
    })
    .catch(error => {
        console.log(error);
    })
}

exports.getCategorys = () => { return categorys }
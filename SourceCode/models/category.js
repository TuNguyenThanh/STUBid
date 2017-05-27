var { query } = require('../helpers/db');
var categorys = [];
loadCategorys();

function loadCategorys() {
    let sql = `SELECT * FROM "Category"`;
    query(sql,[])
    .then(result => {
        categorys = result.rows;
        console.log('loaded ' + result.rowCount + ' categories');
    })
    .catch(error => {
        console.log(error);
    })
}

exports.getCategorys = () => { return categorys }
const { query } = require('../helpers/db');
const ERROR = require('../error.json');

updateProduct = (productId, body) => {
  let keys = Object.keys(body);
  let keysExp = keys.map(e => `"${e}"`).join(',');
  let valuesExp = keys.map((v, i) => `$${i + 1}`).join(',');
  let sql = `UPDATE "Product" SET (${keysExp})=(${valuesExp}) WHERE "productId" = ${productId}`;
  let params = keys.map(e => body[e]);
  return new Promise((resolve, reject) => {
    query(sql, params)
      .then((value) => {
        if (value.rowCount > 0) {
          console.log(`update product : ${productId}`);
          resolve();
        } else {
          reject({
            status: 500,
            error: ERROR[500][1]
          });
        }
      })
      .catch(reject)
  });
}

module.exports = { updateProduct }
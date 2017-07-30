const DB = require('../helpers/db');
const ERROR = require('../error.json');
const CONFIG = require('../config');

getAll = (productIds) => {
  let sql = `SELECT "productId", "name", "description",
  (
      SELECT array_to_json(array_agg(row_to_json(image)))
      FROM (
          SELECT "imageId", name, CONCAT ('${CONFIG.BUCKET.PUBLIC_URL}/',name) AS url
          FROM "Image" AS image
          WHERE image."productId" = "Product"."productId"
      ) AS image
  ) AS images,
  (
      SELECT row_to_json(category)
      FROM "Category" AS category
      WHERE category."categoryId" = "Product"."categoryId"
  ) AS category
  FROM "Product"
  WHERE $1 OR "productId" = ANY ($2::bigint[])
  ORDER BY "productId" ASC`;
  let params = [!productIds, productIds];
  return new Promise((resolve, reject) => {
    DB.query(sql, params)
      .then((value) => {
        if (value.rowCount > 0) {
          resolve(value.rows)
        } else {
          reject({
            status: 500,
            error: ERROR[500][1]
          });
        }
      })
      .catch(reject);
  });
}

get = (productId) => {
  let sql = `SELECT "productId", "name", "description",
  (
      SELECT array_to_json(array_agg(row_to_json(image)))
      FROM (
          SELECT "imageId", name, CONCAT ('${CONFIG.BUCKET.PUBLIC_URL}/',name) AS url
          FROM "Image" AS image
          WHERE image."productId" = "Product"."productId"
      ) AS image
  ) AS images,
  (
      SELECT row_to_json(category)
      FROM "Category" AS category
      WHERE category."categoryId" = "Product"."categoryId"
  ) AS category
  FROM "Product"
  WHERE "productId" = $1
  ORDER BY "productId" ASC`;
  let params = [productId];
  return new Promise((resolve, reject) => {
    DB.query(sql, params)
      .then((value) => {
        if (value.rowCount > 0) {
          resolve(value.rows[0])
        } else {
          reject({
            status: 500,
            error: ERROR[500][1]
          });
        }
      })
      .catch(reject);
  });
}

update = (profileId, body) => {
  let keys = Object.keys(body);
  let keysExp = keys.map(e => `"${e}"`).join(',');
  let valuesExp = keys.map((v, i) => `$${i + 1}`).join(',');
  let sql = `UPDATE "Profile" SET (${keysExp})=(${valuesExp}) WHERE "profileId" = ${profileId}`;
  let params = keys.map(e => body[e]);
  return new Promise((resolve, reject) => {
    DB.query(sql, params)
      .then((value) => {
        if (value.rowCount > 0) {
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

module.exports = {
  getAll,
  get,
  update,
}
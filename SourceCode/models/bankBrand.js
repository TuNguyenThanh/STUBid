const { query } = require('../helpers/db'),
      { DOMAIN_NAME } = require('../config')

exports.getBankBrands = () => {
    return new Promise((resolve,reject) => {
        let sql = `
            SELECT
            "bankBrandId",
            "bankBrandName",
            CONCAT('${DOMAIN_NAME}/assets/bank_logos/',logo) AS "bankLogo"
            FROM "BankBrand"
        `;
        query(sql,[])
        .then(result => resolve(result.rows))
        .catch(error => reject(error))
    })
}

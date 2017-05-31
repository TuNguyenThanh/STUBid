var pg = require('pg');
var config = require('../config').PG;

const pool = new pg.Pool(config);

exports.query = (sql,params) => {
    return new Promise((resolve,reject) => {
        pool.connect(function(error, client, done) {
            if(error) {
                return reject(error);
            }
            client.query(sql, params, function(err, result) {
                done(err);
                if(err) {
                    return reject(err);
                }
                resolve(result)
            });
        });
    })
}

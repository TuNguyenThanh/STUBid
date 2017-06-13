var ERROR = require('../error.json');
var pg = require('pg');
var config = require('../config').PG;

const pool = new pg.Pool(config);

exports.query = (sql,params) => {
    return new Promise((resolve,reject) => {
        pool.connect(function(error, client, done) {
            if(error) {
                return reject({
                    status: 500,
                    error: ERROR[500][0],
                    internalError: error
                });
            }
            client.query(sql, params, function(err, result) {
                done(err);
                if(err) {
                    return reject({
                    status: 500,
                    error: ERROR[500][1],
                    internalError: err
                });
                }
                resolve(result)
            });
        });
    })
}

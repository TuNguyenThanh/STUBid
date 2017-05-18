var pg = require('pg');
var config = {
  user: 'nekpmupamlixdp',
  database: 'dbjr1pl26qp5v',
  password: '469c710d217a284605d4d970365b2a3b820c9591b7a00361b07a7ed1fab2cd85',
  host: 'ec2-54-228-255-234.eu-west-1.compute.amazonaws.com',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: true
};

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

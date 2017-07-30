const jwt = require('jsonwebtoken');
const KEY = 'SECRET_KEY';
const expirationTime = 30 * 120;
const ERROR = require('../error.json');
const {
  query
} = require('./db');

sign = (obj) => {
  let token = jwt.sign(obj, KEY, {
    expiresIn: expirationTime
  });
  let sql = `INSERT INTO "Session"("sessionToken","userId") VALUES($1, $2)`;
  let params = [token, obj.accountId ? obj.accountId : null];
  query(sql, params)
    .then((result) => {
      if (result.rowCount > 0) {
        console.log('created token for account ' + obj.accountId);
      } else {
        console.log({
          status: 500,
          error: ERROR[500][1],
        });
      }
    })
    .catch(reason => console.log(reason));
  return token;
}

verify = (token, ignoreExpiration = false) => {
  return new Promise(function (resolve, reject) {
    query(`SELECT * FROM "Session" WHERE "sessionToken"=$1`, [token])
      .then((result) => {
        if (result.rowCount > 0) {
          jwt.verify(token, KEY, {
            ignoreExpiration
          }, function (error, decoded) {
            if (error) return reject({
              status: 400,
              error: error.name === 'TokenExpiredError' ? ERROR[400][2] : ERROR[400][1],
              internalError: error
            });
            return resolve({
              object: decoded,
              sessionId: result.rows[0].sessionId
            });
          });
        } else {
          reject({
            status: 400,
            error: ERROR[400][1],
          });
        }
      })
      .catch(reject);

  });
}

refreshToken = (obj, sessionId) => {
  obj.exp = Math.floor(Date.now() / 1000) + expirationTime;
  let token = jwt.sign(obj, KEY);
  let sql = `UPDATE "Session" SET ("sessionToken","userId") = ($1, $2) WHERE "sessionId"=$3`;
  let params = [token, obj.accountId ? obj.accountId : null, sessionId];
  query(sql, params)
    .then((result) => {
      if (result.rowCount > 0) {
        console.log('updated token for session ' + sessionId);
      } else {
        console.log({
          status: 500,
          error: ERROR[500][1],
        });
      }
    })
    .catch(reason => console.log(reason));
  return token;
}

removeToken = (sessionId) => {
  query(`DELETE FROM "Session" WHERE "sessionId"=$1`, [sessionId])
    .then((result) => {
      if (result.rowCount > 0) {
        console.log('removed session ' + sessionId);
      } else {
        console.log({
          status: 500,
          error: ERROR[500][1],
          internalError: error
        });
      }
    })
    .catch(reason => console.log(reason));
}

module.exports = {
  sign,
  verify,
  refreshToken,
  removeToken
};
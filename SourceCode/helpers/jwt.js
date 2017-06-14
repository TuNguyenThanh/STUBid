const jwt = require('jsonwebtoken');
const KEY = 'SECRET_KEY';
const expirationTime = 30*60;
const ERROR = require('../error.json');

exports.sign = (object) => {
    return jwt.sign(object, KEY, { expiresIn: expirationTime });
}

exports.verify = (token, ignoreExpiration = false) => {
    return new Promise(function(resolve, reject) {
        jwt.verify(token,KEY,{ ignoreExpiration }, function(error,decoded){
            if (error) return reject({
                status: 400,
                error: error.name==='TokenExpiredError'?ERROR[400][2]:ERROR[400][1],
                internalError: error
            });
            return resolve(decoded);
        });
    });
}

exports.refreshToken = (obj) => {
    obj.exp = Math.floor(Date.now()/1000) + expirationTime;
    return jwt.sign(obj, KEY)
}
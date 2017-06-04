const jwt = require('jsonwebtoken');
const KEY = 'SECRET_KEY';
const expirationTime = 30*60;

exports.sign = (object) => {
    return jwt.sign(object, KEY, { expiresIn: expirationTime });
}

exports.verify = (token, ignoreExpiration = false) => {
    return new Promise(function(resolve, reject) {
        jwt.verify(token,KEY,{ ignoreExpiration }, function(error,decoded){
            if (error) return reject(error);
            return resolve(decoded);
        });
    });
}

exports.refreshToken = (obj) => {
    obj.exp = Math.floor(Date.now()/1000) + expirationTime;
    return jwt.sign(obj, KEY)
}
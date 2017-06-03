const jwt = require('jsonwebtoken');
const KEY = 'SECRET_KEY';

exports.sign = (object) => {
    return jwt.sign(object, KEY, { expiresIn: "30 minutes" });
}

exports.verify = (token) => {
    return new Promise(function(resolve, reject) {
        jwt.verify(token,KEY, function(error,decoded){
            if (error) return reject(error);
            return resolve(decoded);
        });
    });
}
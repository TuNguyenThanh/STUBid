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

exports.getNewToken = (object) => {
    object.exp = Math.floor(Date.now()/(1000)) + 30*60;
    return jwt.sign(object,KEY);
}
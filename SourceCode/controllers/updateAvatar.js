var formidable = require('formidable'),
    fs = require('fs'),
    { DIRNAME, DOMAIN_NAME } = require('../config'),
    { verify, refreshToken } = require('../helpers/jwt'),
    { updateAvatar } = require('../models/account');

module.exports = (req,res) => {
    var imageName = '', token = '';
    var form = new formidable.IncomingForm({ uploadDir: DIRNAME + '/public/images/avatar/' });
    form.on('fileBegin', function(name, file) {
        let arrayFileName = file.name.split('.'),
            fileExtension = arrayFileName[arrayFileName.length - 1];
        arrayFileName[arrayFileName.length - 1] = Date.now();
        file.name = imageName = arrayFileName.join('-') + '.' + fileExtension;
        file.path = form.uploadDir + file.name;
    });
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
    });
    form.on('error', function(err) {
        console.log(err);
    });
    new Promise(function(resolve, reject) {
        form.parse(req, function(err, fields, files) {
            if (err) return reject(err);
            return resolve(fields);
        });
    })
    .then(fields => {
        if (!fields.token)
            return Promise.reject(new Error('missing parameters'))
        return verify(fields.token);
    })
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject(new Error('authentication failed'));
        token = refreshToken(obj);
        return updateAvatar(obj.accountId, imageName)
    })
    .then(avatar => {
        res.send({
            success: true,
            avatar: `${DOMAIN_NAME}/images/avatar/${imageName}`,
            token
        })
        fs.unlink(form.uploadDir + avatar, error => {
            console.log(error + '');
        });
    })
    .catch(function(error){
        console.log(error);
        res.send({
            success: false,
            error: error + ''
        })
        fs.unlink(form.uploadDir + imageName, error => {
            console.log(error + '');
        });
    });
}
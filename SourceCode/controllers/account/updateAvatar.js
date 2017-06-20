const formidable = require('formidable'),
      fs = require('fs'),
      { DIRNAME, DOMAIN_NAME } = require('../../config'),
      { verify, refreshToken } = require('../../helpers/jwt'),
      { updateAvatar } = require('../../models/account'),
      ERROR = require('../../error.json');

module.exports = (req,res) => {
    var imageName = '', token = '';
    var form = new formidable.IncomingForm({ uploadDir: DIRNAME + '/public/images/avatar/' });
    form.on('fileBegin', function(name, file) {
        imageName = file.name;
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
            if (err) return reject({
                status: 500,
                error: ERROR[500][20],
                internalError: err
            });
            return resolve(fields);
        });
    })
    .then(fields => {
        if (!fields.token)
            return Promise.reject({
                status: 400,
                error: ERROR[400][0]
            })
        return verify(fields.token);
    })
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            });
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
    .catch(function(reason){
        console.log(reason);
        res.status(reason.status).send({
            success: false,
            error: reason.error
        })
        fs.unlink(form.uploadDir + imageName, error => {
            console.log(error + '');
        });
    });
}
const formidable = require('formidable');
const fs = require('fs');
const { DIRNAME, DOMAIN_NAME, AWS_AUTH } = require('../../config');
const { verify, refreshToken } = require('../../helpers/jwt');
const { updateAvatar } = require('../../models/account');
const ERROR = require('../../error.json');
const s3Uploader = require('../../helpers/s3');

module.exports = (req, res) => {
    var imageName = '', token = '';
    var form = new formidable.IncomingForm({ uploadDir: DIRNAME + '/public/' });
    form.on('fileBegin', function (name, file) {
        imageName = 'avatar_' + file.name;
        file.path = form.uploadDir + file.name;
    });
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
        let fileStream = fs.createReadStream(form.uploadDir + file.name);
        s3Uploader.upload('avatar_' + file.name, fileStream)
            .then(params => {
                console.log(params);
                fs.unlink(form.uploadDir + file.name, error => {
                    if (error) console.log(error);
                    else console.log('deleted local image : ' + imageName);
                });
            })
            .catch(reason => {
                console.log(reason);
            })
    });
    form.on('error', function (err) {
        console.log(err);
    });
    new Promise(function (resolve, reject) {
        form.parse(req, function (err, fields, files) {
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
        .then(({obj, sessionId}) => {
            if (!obj.accountId)
                return Promise.reject({
                    status: 400,
                    error: ERROR[400][1]
                });
            token = refreshToken(obj, sessionId);
            return updateAvatar(obj.accountId, imageName)
        })
        .then(avatar => {
            res.send({
                success: true,
                avatar: avatar.new,
                token
            })
        })
        .catch(function (reason) {
            console.log(reason);
            res.send({
                success: false,
                error: reason.error
            })
            fs.unlink(form.uploadDir + imageName, error => {
                if (error) console.log(error);
                else console.log('deleted local image : ' + imageName);
            });
        });
}
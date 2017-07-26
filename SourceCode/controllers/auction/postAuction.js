const formidable = require('formidable');
const fs = require('fs');
const { DIRNAME, DOMAIN_NAME, AWS_AUTH } = require('../../config');
const { verify, refreshToken } = require('../../helpers/jwt');
const { insertAuction } = require('../../models/auction');
const ERROR = require('../../error.json');
const s3Uploader = require('../../helpers/s3');

module.exports = (req, res) => {
    var productImages = [], token = '', auctionInfo;
    var form = new formidable.IncomingForm({ uploadDir: DIRNAME + '/public/' });
    form.on('fileBegin', function (name, file) {
        productImages.push('product_' + file.name);
        file.path = form.uploadDir + file.name;
    });
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
        let fileStream = fs.createReadStream(form.uploadDir + file.name);
        s3Uploader.upload('product_' + file.name, fileStream)
            .then(params => {
                console.log(params);
                fs.unlink(form.uploadDir + file.name, error => {
                    if (error) console.log(error);
                    else console.log('deleted local image : ' + file.name);
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
            console.log(fields);
            if (!(fields.token && fields.productName && fields.description && fields.categoryId
                && fields.duration && fields.startPrice && fields.bidIncreasement))
                return Promise.reject({
                    status: 400,
                    error: ERROR[400][0]
                })
            auctionInfo = fields;
            return verify(fields.token);
        })
        .then(({object, sessionId}) => {
            if (!object.accountId)
                return Promise.reject({
                    status: 400,
                    error: ERROR[400][1]
                });
            token = refreshToken(object, sessionId);
            let {
            productName, description, searchKey, categoryId,
                duration, startPrice, ceilingPrice,
                bidIncreasement, comment,
                productReturningAddress,
                moneyReceivingBankRefId, moneyReceivingAddress, allowedUserLevel
        } = auctionInfo;
            if (ceilingPrice) ceilingPrice = parseInt(ceilingPrice);
            return insertAuction(
                productName, description, JSON.parse('["test"]'), parseInt(categoryId),
                productImages,
                parseInt(duration), parseInt(startPrice), (ceilingPrice && ceilingPrice !== NaN) ? ceilingPrice : null,
                parseInt(bidIncreasement), comment,
                productReturningAddress ? productReturningAddress : null, object.accountId,
                moneyReceivingBankRefId ? parseInt(moneyReceivingBankRefId) : null, moneyReceivingAddress ? moneyReceivingAddress : null, allowedUserLevel ? parseInt(allowedUserLevel) : null
            )
        })
        .then(() => {
            res.send({
                success: true,
                token
            });
        })
        .catch(function (reason) {
            console.log(reason);
            res.send({
                success: false,
                error: reason.error
            })
            productImages.forEach(e => {
                fs.unlink(form.uploadDir + e, error => {
                    if (error) console.log(error);
                    else console.log('deleted product image : ' + e);
                });
            })
        });
}

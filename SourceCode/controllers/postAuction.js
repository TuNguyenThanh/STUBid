const formidable = require('formidable'),
      fs = require('fs'),
      ERROR = require('../error'),
      { DIRNAME } = require('../config'),
      { verify, refreshToken } = require('../helpers/jwt'),
      { insertAuction } = require('../models/auction');

module.exports = (req,res) => {
    var productImages = [], token = '', auctionInfo;
    var form = new formidable.IncomingForm({ uploadDir: DIRNAME + '/public/images/product/' });
    form.on('fileBegin', function(name, file) {
        productImages.push(file.name);
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
    .then(obj => {
        if (!obj.accountId)
            return Promise.reject({
                status: 400,
                error: ERROR[400][1]
            });
        token = refreshToken(obj);
        let {
            productName, description, searchKey, categoryId,
            duration, startPrice, ceilingPrice,
            bidIncreasement, comment,
            productReturningAddress,
            moneyReceivingBankRefId, moneyReceivingAddress, allowedUserLevel
        } = auctionInfo;
        return insertAuction(
            productName, description, JSON.parse('["test"]'), parseInt(categoryId),
            productImages,
            parseInt(duration), parseInt(startPrice), ceilingPrice?parseInt(ceilingPrice):null,
            parseInt(bidIncreasement), comment,
            productReturningAddress?productReturningAddress:null, obj.accountId,
            moneyReceivingBankRefId?parseInt(moneyReceivingBankRefId):null, moneyReceivingAddress?moneyReceivingAddress:null, allowedUserLevel?parseInt(allowedUserLevel):null
        )
    })
    .then(() => {
        res.send({
            success: true,
            token
        })
    })
    .catch(function(reason){
        console.log(reason);
        res.status(reason.status).send({
            success: false,
            error: reason.error
        })
        productImages.forEach(e => {
            fs.unlink(form.uploadDir + e, error => {
                console.log(error + '');
            });
        })
    });
}
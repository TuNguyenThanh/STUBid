const   eSMS = require('../config').eSMS,
        http = require('http'),
        ERROR = require('../error.json');

exports.sendSMS = (phoneNumber, verifyCode) => {
    let message = encodeURIComponent(`Ma xac thuc tai khoan sBid cua ban la ${verifyCode}. Ma xac thuc co hieu luc trong 10 phut`);
    options = {
        host : 'rest.esms.vn',
        path : `/MainService.svc/json/SendMultipleMessage_V4_get?Phone=${phoneNumber}&Content=${message}&ApiKey=${eSMS.API_KEY}&SecretKey=${eSMS.SECRET_KEY}&SmsType=7`,
        method : 'GET'
    };
    return new Promise((resolve,reject) => {
        http.request(options, response => {
            let body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', () => {
                var json = JSON.parse(body);
                if (json.CodeResult === '100')
                    resolve();
                else reject({
                    status: 500,
                    error: ERROR[500][10],
                    internalError: json.ErrorMessage
                });
            })
        }).end();
    })
}
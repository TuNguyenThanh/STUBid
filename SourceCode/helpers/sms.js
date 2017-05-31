const eSMS = require('../config').eSMS;

module.exports = (phoneNumber, content) => {
    `http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?Phone=${phoneNumber}&Content=${Content}&ApiKey=${eSMS.API_KEY}&SecretKey=${eSMS.SECRET_KEY}&SmsType=7`
}
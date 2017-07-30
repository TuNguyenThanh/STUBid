var {
  register,
  exist,
  pushRegisterQueue
} = require('../../models/account'), {
    sendSMS
  } = require('../../helpers/sms'),
  ERROR = require('../../error.json');

module.exports = (req, res) => {
  var {
    firstName,
    lastName,
    phoneNumber,
    email,
    username,
    password,
    verifyCode
  } = req.body;
  if (!verifyCode) {
    if (!firstName || !lastName || !phoneNumber || !email || !username || !password) {
      return res.send({
        success: false,
        error: ERROR[400][0]
      })
    }
    exist(username, email, phoneNumber)
      .then(() => {
        let code = pushRegisterQueue(firstName, lastName, phoneNumber, email, username, password)
        return sendSMS(phoneNumber, code);
      })
      .then(() => {
        res.send({
          success: true,
          step: 1
        })
      })
      .catch(reason => {
        console.log(reason);
        res.send({
          success: false,
          error: reason.error
        })
      })
  } else {
    if (!phoneNumber || !email || !username) {
      return res.send({
        success: false,
        error: ERROR[400][0]
      })
    }
    register(verifyCode, phoneNumber, email, username)
      .then(() => {
        res.send({
          success: true,
          step: 2
        })
      })
      .catch(reason => {
        console.log(reason);
        res.send({
          success: false,
          error: reason.error
        })
      })
  }
}
const { sendResetPasswordEmail } = require('../helpers/mailer'),
      { sign } = require('../helpers/jwt'),
      { forgotPassword } = require('../models/account');

module.exports = (req,res) => {
    var { email } = req.body;
    if (!email) {
        return res.send({ success: false, error: 'email is required' })
    }
    forgotPassword(email)
    .then(result => {
        return sendResetPasswordEmail(email, result.firstName, sign({ accountId: result.accountId }))
    })
    .then(() => {
        res.send({ success: true })
    })
    .catch(error => {
        console.log(error);
        res.send({ success: false, error: error + '' })
    })
}
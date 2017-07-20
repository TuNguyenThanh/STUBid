const { sendResetPasswordEmail } = require('../../helpers/mailer'),
      { sign } = require('../../helpers/jwt'),
      { forgotPassword } = require('../../models/account'),
      ERROR = require('../../error.json');

module.exports = (req,res) => {
    var { email } = req.body;
    console.log(email);
    if (!email) {
        return res.send({
            success: false,
            error: ERROR[400][0]
        })
    }
    forgotPassword(email)
    .then(result => {
        return sendResetPasswordEmail(email, result.firstName, sign({ accountId: result.accountId }))
    })
    .then(() => {
        res.send({ success: true })
    })
    .catch(reason => {
        console.log(reason);
        res.send({
            success: false,
            error: reason.error
        })
    })
}
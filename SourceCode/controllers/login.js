var { login } = require('../models/account'),
    { sign, verify } = require('../helpers/jwt');

module.exports = (req,res) => {
    new Promise((resolve,reject) => {
        if (req.body.username && req.body.password)
            resolve(login(undefined, req.body.username, req.body.password));
        else {
            verify(req.body.token)
            .then(object => {
                if (object.accountId) {
                    resolve(login(object.accountId));
                }
                else reject(new Error('token error'));
            })
            .catch(error => reject(error))
        }
    })
    .then(account => {
        res.send({
            ok: true,
            token: sign({
                accountId: account.accountId,
                username: account.username,
                isAdmin: account.isAdmin
            }),
            profile: {
                accountId: account.accountId,
                firstName: account.firstName,
                lastName: account.lastName,
                phoneNumber: account.phoneNumber,
                email: account.email,
                avatar: account.avatar,
                bankRefNumber: account.bankRefNumber,
                bankRefName: account.bankRefName
            }
        });
    })
    .catch(error => {
        console.log(error + '');
        res.send({
            ok: false,
            error: error
        });
    })
}
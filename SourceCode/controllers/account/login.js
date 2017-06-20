var { login } = require('../../models/account'),
    { sign, verify } = require('../../helpers/jwt'),
    ERROR = require('../../error.json');

module.exports = (req,res) => {
    new Promise((resolve,reject) => {
        if (req.body.username && req.body.password)
            resolve(login(undefined, req.body.username, req.body.password));
        else if (req.body.token) {
            verify(req.body.token, true)
            .then(object => {
                if (object.accountId) {
                    resolve(login(object.accountId));
                }
                else reject({
                    status: 400,
                    error: ERROR[400][1]
                });
            })
            .catch(reason => reject(reason))
        }
        else {
            reject({
                status: 400,
                error: ERROR[400][0]
            });
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
                bankRef: account.bankRef
            }
        });
    })
    .catch(reason => {
        console.log(reason);
        res.status(reason.status).send({
            ok: false,
            error: reason.error
        });
    })
}
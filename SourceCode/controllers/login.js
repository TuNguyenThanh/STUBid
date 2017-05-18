var { login } = require('../models/account'),
    { sign } = require('../helpers/jwt');

module.exports = (req,res) => {
    login(req.body.username, req.body.password)
    .then(result => {
        if (result.rowCount == 1) {
            let account = result.rows[0];
            if (account.bannedLevel >= 2)
                res.send({
                    success: false,
                    error: {
                        code: 103,
                        description: 'account has been banned at level 2'
                    }
                });
            else if (
                account.bannedLevel >=1
                && (Date.now() - new Date(account.bannedDate).getTime()) < (3*24*60*60*1000)
            )
                res.send({
                    success: false,
                    error: {
                        code: 102,
                        description: 'account has been banned at level 1'
                    }
                });
            else
                res.send({
                    success: true,
                    token: sign({
                        accountId: account.accountId,
                        username: account.username,
                        isAdmin: account.isAdmin,
                        profileId: account.profileId
                    })
                });
        }
        else {
            res.send({
                success: false,
                error: {
                    code: 101,
                    description: 'wrong username or password'
                }
            });
        }
    })
    .catch(error => {
        console.log(error + '');
        res.send({
            success: false,
            error: {
                code: 99,
                description: 'system error'
            }
        });
    })
}
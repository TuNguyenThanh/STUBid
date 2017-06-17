var { query } = require('../helpers/db'),
    { DOMAIN_NAME } = require('../config'),
    ERROR = require('../error.json'),
    md5 = require('blueimp-md5'),
    registerQueue = [];

exports.login = (accountId, username, password) => {
    return new Promise((resolve,reject) => {
        let sql = `
            SELECT
            "Account"."accountId",
            "Account"."username",
            "Account"."isAdmin",
            "Account"."bannedLevel",
            "Account"."bannedDate",
            "Account"."sBidPoint",
            "Profile"."firstName",
            "Profile"."lastName",
            "Profile"."phoneNumber",
            "Profile".email,
            "Profile".avatar,
            (
                SELECT row_to_json(bankRef)
                FROM (
                    SELECT
                    "BankRef"."bankRefId",
                    "BankRef"."bankAccountNumber",
                    "BankBrand"."bankBrandId",
                    "BankBrand"."bankBrandName"
                    FROM "BankRef"
                    INNER JOIN "BankBrand" ON "BankBrand"."bankBrandId" = "BankRef"."bankBrandId"
                    WHERE "accountId" = "Account"."accountId"
                    ORDER BY "BankRef"."bankRefId" DESC
                    LIMIT 1
                ) AS bankRef
			) AS "bankRef"
            FROM "Account"
            INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
            ${accountId?'WHERE "Account"."accountId"=$1':'WHERE username=$1 AND password=$2'}
        `;
        let params = accountId?[accountId]:[username, password];
        query(sql,params)
        .then(result => {
            if (result.rowCount !== 1) return reject({ status: 400, error: ERROR[400][20] });
            let account = result.rows[0];
            if (account.bannedLevel >= 2) return reject({ status: 400, error: ERROR[400][22] });
            if (
                account.bannedLevel >=1
                && (Date.now() - new Date(account.bannedDate).getTime()) < (3*24*60*60*1000)
            )
                return reject({ status: 400, error: ERROR[400][21] });
            account.avatar = account.avatar?`${DOMAIN_NAME}/images/avatar/${account.avatar}`:null;
            if (!account.bankRef === true) account.bankRef = null;
            resolve(account)
        })
        .catch(error => reject(error));
    })
}

exports.exist = (username, email, phoneNumber) => {
    return new Promise((resolve,reject) => {
        if (registerQueue.find(e => e.email == email)) reject({ status: 400, error: ERROR[400][10] });
        else if (registerQueue.find(e => e.phoneNumber == phoneNumber)) reject({ status: 400, error: ERROR[400][11] });
        else if (registerQueue.find(e => e.username == username)) reject({ status: 400, error: ERROR[400][12] });

        let sql     = `SELECT "Account".username, "Profile".email, "Profile"."phoneNumber"
                    FROM "Account" INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
                    WHERE username=$1 OR email=$2 OR "phoneNumber"=$3`,
            params  = [username, email, phoneNumber];
        query(sql, params)
        .then(result => {
            let rows = result.rows;
            if (rows.length === 0) {
                resolve();
            }
            else {
                if (rows.find(e => e.email == email)) reject({ status: 400, error: ERROR[400][10] });
                else if (rows.find(e => e.phoneNumber == phoneNumber)) reject({ status: 400, error: ERROR[400][11] });
                else if (rows.find(e => e.username == username)) reject({ status: 400, error: ERROR[400][12] });
            }
        })
        .catch(error => reject(error));
    })
}

exports.pushRegisterQueue = (firstName, lastName, phoneNumber, email, username, password) => {
    let content = md5(username + Date.now());
    let verifyCode = content.substr(content.length - 6, content.length - 1).toUpperCase();
    console.log('verify code: ' + verifyCode);
    registerQueue.push({
        username, email, phoneNumber, password, firstName, lastName, verifyCode,
        countdown: setTimeout(function() {
            registerQueue.splice(registerQueue.findIndex(e => e.username === username), 1)
        }, 10*60*1000)
    });
    return verifyCode;
}

exports.resetVerifyCode = (phoneNumber, email, username) => {
    return new Promise((resolve, reject) => {
        let index = registerQueue.findIndex(e => (
            e.username === username
            && e.email === email
            && e.phoneNumber === phoneNumber
        ));
        if (index < 0)
            return reject({
                status: 400,
                error: ERROR[400][14]
            });
        let content = md5(username + Date.now());
        let verifyCode = content.substr(content.length - 6, content.length - 1).toUpperCase();
        registerQueue[index].verifyCode = verifyCode;
        clearTimeout(registerQueue[index].countdown);
        registerQueue[index].countdown = setTimeout(function() {
            registerQueue.splice(registerQueue.findIndex(e => e.username === username), 1)
        }, 10*60*1000);
        console.log('verify code: ' + verifyCode);
        return resolve(verifyCode);
    })
}

exports.register = (verifyCode, phoneNumber, email, username) => {
    return new Promise((resolve,reject) => {
        let index = registerQueue.findIndex(e => (
                e.username === username
                && e.email === email
                && e.phoneNumber === phoneNumber
                && e.verifyCode === verifyCode
            ));
        if (index >= 0) {
            let { firstName, lastName, phoneNumber, email, username, password, countdown } = registerQueue[index];
            let sql = `
                WITH profile AS (
                    INSERT INTO "Profile"(
                        "firstName", "lastName", "phoneNumber", email)
                        VALUES ($1,$2,$3,$4)
                    RETURNING "profileId"
                ),
                account AS (
                    INSERT INTO "Account"(username, password, "createdDate", "bannedLevel", "isAdmin", "profileId")
                    VALUES ($5, $6, now(), 0, false, (SELECT "profileId" FROM profile))
                    RETURNING "Account"."accountId"
                )
                SELECT * FROM account
            `
            let params = [firstName, lastName, phoneNumber, email, username, password];
            query(sql,params)
            .then(result => {
                if (result.rowCount > 0) {
                    clearTimeout(countdown);
                    registerQueue.splice(index, 1);
                    resolve();
                }
                else reject({
                    status: 500,
                    error: ERROR[500][1]
                });
            })
            .catch(error => reject(error))
        }
        else reject({
            status: 400,
            error: ERROR[400][13]
        });
    })
}

exports.forgotPassword = (email) => {
    return new Promise((resolve,reject) => {
        let sql = `SELECT
            "Account"."accountId",
            "Profile"."firstName"
            FROM "Account"
            INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
            WHERE email=$1`;
        let params = [email];
        query(sql,params)
        .then(result => {
            if (result.rowCount === 1) {
                let account = result.rows[0];
                resolve({ accountId: account.accountId, firstName: account.firstName });
            }
            else {
                reject({
                    status: 400,
                    error: ERROR[400][40]
                });
            }
        })
        .catch(error => reject(error));
    })
}

exports.resetPassword = (accountId) => {
    let content = md5(accountId + '' + Date.now());
    let newPassword = content.substr(content.length - 6, content.length - 1).toUpperCase();
    console.log('new password: ' + newPassword);
    return new Promise((resolve,reject) => {
        let sql = `UPDATE "Account"
            SET password=$1
            WHERE "accountId"=$2`;
        let params = [md5(newPassword), accountId];
        query(sql,params)
        .then(result => {
            if (result.rowCount === 1) {
                resolve(newPassword);
            }
            else {
                reject({
                    status: 500,
                    error: ERROR[500][1]
                });
            }
        })
        .catch(error => reject(error));
    })
}

exports.changePassword = (accountId, currentPassword, newPassword) => {
    console.log(accountId);
    return new Promise((resolve,reject) => {
        let sql = `SELECT FROM "Account" WHERE "accountId" = $1 AND password = $2`,
            params = [accountId, currentPassword];
        query(sql,params)
        .then(result => {
            if (result.rowCount !== 1)
                return Promise.reject({
                    status: 400,
                    error: ERROR[400][30]
                });
            let sql = `UPDATE "Account" SET password = $1 WHERE "accountId" = $2`,
            params = [newPassword, accountId];
            return query(sql,params);
        })
        .then(result => {
            if (result.rowCount !== 1)
                reject({
                    status: 500,
                    error: ERROR[500][1]
                });
            else resolve();
        })
        .catch(error => {
            reject(error);
        })
    });
}

exports.updateProfile = (accountId, firstName, lastName, phoneNumber, email, bankRef) => {
    return new Promise((resolve,reject) => {
        let isDelete = !bankRef || bankRef.bankAccountNumber.length===0;
        let sql = isDelete?`DELETE FROM "BankRef" WHERE "accountId"=$1`
                          :`SELECT "bankRefId" FROM "BankRef" WHERE "accountId"=$1`;
        let params = [accountId];
        query(sql,params)
        .then(value => {
            sql = `
                WITH selectProfileResult AS (
                    SELECT "profileId" FROM "Account" WHERE "accountId" = $1
                ),
                updateProfileResult AS (
                    UPDATE "Profile"
                    SET "firstName" = $2, "lastName" = $3, "phoneNumber" = $4, email = $5
                    WHERE "profileId" = (SELECT "profileId" FROM selectProfileResult)
                    RETURNING "profileId"
                )
            `;
            params = [accountId, firstName, lastName, phoneNumber, email];
            if (isDelete) {
                sql += `SELECT * FROM updateProfileResult`;
            } else {
                if (value.rowCount === 1) {
                    sql += `,updateBankRefResult AS (
                        UPDATE "BankRef"
                        SET "bankAccountNumber" = $6, "bankBrandId" = $7
                        WHERE "bankRefId" = $8
                        RETURNING "bankRefId"
                    )
                    SELECT * FROM updateProfileResult, updateBankRefResult`;
                    params = params.concat([bankRef.bankAccountNumber, bankRef.bankBrandId, value.rows[0].bankRefId]);
                }
                else {
                    sql += `,insertBankRefResult AS (
                        INSERT INTO "BankRef"("bankAccountNumber","bankBrandId","accountId")
                        VALUES($6,$7,$1)
                        RETURNING "bankRefId"
                    )
                    SELECT * FROM updateProfileResult, insertBankRefResult`;
                    params = params.concat([bankRef.bankAccountNumber,bankRef.bankBrandId]);
                }
            }
            return query(sql,params);
        })
        .then(result => {
            if (result.rowCount !== 1)
                reject({
                    status: 500,
                    error: ERROR[500][1]
                });
            else resolve();
        })
        .catch(error => {
            reject(error);
        })
    });
}

exports.updateAvatar = (accountId, avatar) => {
    return new Promise((resolve,reject) => {
        let sql = `
            WITH result1 AS (
                SELECT "Profile"."profileId", avatar
                FROM "Account"
                INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
                WHERE "accountId" = $1
            ),
            result2 AS (
                UPDATE "Profile"
                SET avatar = $2
                WHERE "profileId" = (SELECT "profileId" FROM result1)
                RETURNING avatar
            )
            SELECT * FROM result1
        `;
        let params = [accountId, avatar];
        query(sql,params)
        .then(result => {
            if (result.rowCount !== 1)
                reject({
                    status: 500,
                    error: ERROR[500][1]
                });
            else resolve(result.rows[0].avatar);
        })
        .catch(error => {
            reject(error);
        })
    });
}
var { query } = require('../helpers/db'),
    { DOMAIN_NAME } = require('../config'),
    md5 = require('blueimp-md5'),
    registerQueue = [];

exports.createAccount = (username, password, isAdmin, profileId) => {
    return new Promise((resolve,reject) => {
        let sql = `INSERT INTO "Account"(username,password,"createdDate","bannedLevel","isAdmin","profileId")
            VALUES($1,$2,$3,$4,$5,$6)`,
            params = [username, password, new Date().toISOString(), 0, isAdmin, profileId];
        query(sql,params)
        .then(result => {
            console.log('create account: ' + username);
            resolve();
        })
        .catch(error => reject(error));
    })
}

exports.getAccount = (accountId) => {
    return new Promise((resolve,reject) => {
        let sql = `SELECT * FROM "Account" WHERE "accountId"=$1`,
            params = [accountId];
        query(sql,params)
        .then(result => resolve({ rowCount: result.rowCount, rows: result.rows }))
        .catch(error => reject(error));
    })
}

exports.getAccounts = () => {
    return new Promise((resolve,reject) => {
        let sql = `SELECT * FROM "Account"`,
            params = [];
        query(sql,params)
        .then(result => resolve({ rowCount: result.rowCount, rows: result.rows }))
        .catch(error => reject(error));
    })
}

exports.updateAccount = (accountId, password, bannedLevel, isAdmin, profileId) => {
    return new Promise((resolve,reject) => {
        let sql = `UPDATE "Account" SET password=$2, "bannedLevel"=$3, "isAdmin"=$4, "profileId"=$5 WHERE "accountId"=$1`,
            params = [accountId, password, bannedLevel, isAdmin, profileId];
        query(sql,params)
        .then(result => {
            console.log('update account: ' + accountId);
            resolve();
        })
        .catch(error => reject(error));
    })
}

exports.deleteAccount = (accountId) => {
    return new Promise((resolve,reject) => {
        let sql = `DELETE FROM "Account" WHERE "accountId"=$1`,
            params = [accountId];
        query(sql,params)
        .then(result => {
            console.log(result);
            resolve();
        })
        .catch(error => reject(error));
    })
}

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
            CONCAT ('${DOMAIN_NAME}/images/avatar/',"Profile".avatar) AS avatar,
            "BankBrand"."bankBrandName" AS "bankRefName",
            substr("BankRef"."bankAccountNumber", length("BankRef"."bankAccountNumber") - 3, length("BankRef"."bankAccountNumber")) AS "bankRefNumber"
            FROM "Account"
            INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
            LEFT JOIN "BankRef" ON "BankRef"."accountId" = "Account"."accountId"
            LEFT JOIN "BankBrand" ON "BankBrand"."bankBrandId" = "BankRef"."bankBrandId"
            ${accountId?'WHERE "Account"."accountId"=$1':'WHERE username=$1 AND password=$2'}
        `;
        let params = accountId?[accountId]:[username, password];
        query(sql,params)
        .then(result => {
            if (result.rowCount !== 1) return reject(new Error('wrong username or password'));
            let account = result.rows[0];
            if (account.bannedLevel >= 2) return reject(new Error('account has been banned at level 2'));
            if (
                account.bannedLevel >=1
                && (Date.now() - new Date(account.bannedDate).getTime()) < (3*24*60*60*1000)
            )
                return reject(new Error('account has been banned at level 1'));
            resolve(account)
        })
        .catch(error => reject(error));
    })
}

exports.exist = (username, email, phoneNumber) => {
    return new Promise((resolve,reject) => {
        if (registerQueue.find(e => e.username == username)) reject(new Error('username existed'));
        else if (registerQueue.find(e => e.phoneNumber == phoneNumber)) reject(new Error('phone number existed'));
        else if (registerQueue.find(e => e.email == email)) reject(new Error('email existed'));

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
                if (rows.find(e => e.username == username)) reject(new Error('username existed'));
                else if (rows.find(e => e.phoneNumber == phoneNumber)) reject(new Error('phone number existed'));
                else if (rows.find(e => e.email == email)) reject(new Error('email existed'));
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
    let index = registerQueue.findIndex(e => (
        e.username === username
        && e.email === email
        && e.phoneNumber === phoneNumber
    ));
    if (index >= 0) {
        let content = md5(username + Date.now());
        let verifyCode = content.substr(content.length - 6, content.length - 1).toUpperCase();
        registerQueue[index].verifyCode = verifyCode;
        clearTimeout(registerQueue[index].countdown);
        registerQueue[index].countdown = setTimeout(function() {
            registerQueue.splice(registerQueue.findIndex(e => e.username === username), 1)
        }, 10*60*1000);
        console.log('verify code: ' + verifyCode);
        return { verifyCode }
    }
    else {
        return { error: new Error('account does not exist') }
    }
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
                else reject(new Error('system error'));
            })
            .catch(error => {
                console.log(error);
                reject(new Error('system error'));
            })
        }
        else reject(new Error('wrong verify code'));
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
                reject(new Error('email is not found'));
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
                reject(new Error('system error'));
            }
        })
        .catch(error => reject(error));
    })
}
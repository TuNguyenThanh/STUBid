var { query } = require('../helpers/db'),
    { DOMAIN_NAME } = require('../config'),
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

exports.login = (username, password) => {
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
            INNER JOIN "BankRef" ON "BankRef"."accountId" = "Account"."accountId"
            INNER JOIN "BankBrand" ON "BankBrand"."bankBrandId" = "BankRef"."bankBrandId"
            WHERE username=$1 AND password=$2
        `,
            params = [username, password];
        query(sql,params)
        .then(result => resolve({ rowCount: result.rowCount, rows: result.rows }))
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
                registerQueue.push({ username, email, phoneNumber });
                setTimeout(function() {
                    registerQueue.splice(registerQueue.findIndex(e => e.username === username),1)
                }, 10*60*1000);
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

exports.register = () => {

}
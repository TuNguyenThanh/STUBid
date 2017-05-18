var { query } = require('../helpers/db'),
    { DOMAIN_NAME } = require('../config');

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
        let sql = `SELECT * FROM "Account" WHERE username=$1 AND password=$2`,
            params = [username, password];
        query(sql,params)
        .then(result => resolve({ rowCount: result.rowCount, rows: result.rows }))
        .catch(error => reject(error));
    })
}
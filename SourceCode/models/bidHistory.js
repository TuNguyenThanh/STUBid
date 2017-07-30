const DB = require('../helpers/db');
const ERROR = require('../error.json');
const AUCTION = require('./auction');

getByAuction = (auctionId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT "BidHistory".*,
      "Profile"."profileId",
      "Profile"."firstName",
      "Profile"."lastName"
    FROM "BidHistory"
    INNER JOIN "Account" ON "Account"."accountId" = "BidHistory"."bidderAccountId"
    INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
    WHERE "BidHistory"."auctionId" = $1`;
    let params = [auctionId];
    DB.query(sql, params)
      .then((value) => {
        let data = value.rows.map(e => {
          return {
            bidHistoryId: e.bidHistoryId,
            timestamp: e.timestamp,
            price: e.price,
            bidder: {
              accountId: e.accountId,
              profileId: e.profileId,
              firstName: e.firstName,
              lastName: e.lastName
            }
          }
        });
        resolve(data)
      })
      .catch(reject);
  });
}

var insert = (auctionId, accountId, price, buyNow) => {
  return new Promise((resolve, reject) => {
    var sql = `
      WITH "highestBid" AS (
        SELECT price FROM "BidHistory"
        WHERE "BidHistory"."auctionId" = $2
        ORDER BY price DESC
        LIMIT 1
      ), "latestBid" AS (
        INSERT INTO "BidHistory"(timestamp,price,"auctionId","bidderAccountId")
        SELECT now(), $1, $2, $3
        WHERE (SELECT price FROM "highestBid") < $1
        RETURNING "bidderAccountId", price, timestamp
      )${buyNow ? `, auction AS (
        UPDATE "Auction" SET state = 2
        WHERE "auctionId"=$2
        RETURNING "auctionId"
      )`: ''}
      SELECT * FROM "latestBid"
    `;
    let params = [price, auctionId, accountId];
    DB.query(sql, params)
      .then(result => {
        if (result.rowCount > 0) {
          if (buyNow) {
            AUCTION.buyNow(auctionId);
            resolve();
          } else {
            resolve();
          }
        } else {
          reject({
            status: 400,
            error: ERROR[400][51]
          });
        }
      })
      .catch(error => {
        reject(error);
      })
  })
}

module.exports = {
  getByAuction,
  insert
};
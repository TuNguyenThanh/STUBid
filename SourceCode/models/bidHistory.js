const { query } = require('../helpers/db');
const ERROR = require('../error.json');

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
    query(sql, params)
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

module.exports = { getByAuction };
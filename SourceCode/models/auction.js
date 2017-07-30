const {
  timeLeftFormat
} = require('../helpers/time');
const DB = require('../helpers/db');
const {
  DOMAIN_NAME,
  BUCKET
} = require('../config');
const ERROR = require('../error.json');
const latinize = require('latinize');

var auctionInfos = new Map();
var isExistClosed;
loadAuctions();
setInterval(() => countDown(), 1000);

function countDown() {
  isExistClosed = false;
  auctionInfos.forEach((v, k) => {
    if (v.timeLeft > 0) {
      v.timeLeft--;
    } else {
      delete auctionInfos.delete(k);
      DB.query(`UPDATE "Auction" SET state=2 WHERE "auctionId"=$1`, [k])
        .then(value => {
          console.log(`close auction : ${k}`);
        })
        .catch(reason => {
          console.log(`fail to close auction : ${k}`);
        })
    }
  });
}

function loadAuctions() {
  let sql = `
        SELECT
            "Auction"."auctionId", "activatedDate", "duration",
            "Product".name AS "productName", "categoryId"
        FROM "Auction"
        INNER JOIN "Product" ON "Product"."productId" = "Auction"."productId"
        WHERE "Auction".state = 1
    `;
  DB.query(sql, [])
    .then((result) => {
      let now = Date.now();
      let auctions = result.rows;
      auctions = auctions.map((e) => {
          let timeLeft = e.duration * 60 * 60 - Math.floor((now - new Date(e.activatedDate).getTime()) / 1000);
          e.timeLeft = timeLeft;
          e.searchKeys = latinize(e.productName).toLowerCase();
          return e;
        })
        .sort((a, b) => a.timeLeft > b.timeLeft)
        .forEach((e) => auctionInfos.set(e.auctionId, e));
      console.log('loaded ' + result.rowCount + ' auctions');
    })
    .catch(console.log);
}

var getAll = (auctionIds) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT "auctionId", "createdDate", "activatedDate", "duration", "startPrice", "ceilingPrice", "bidIncreasement",
    (
        SELECT row_to_json(seller)
        FROM (
            SELECT "accountId", "firstName", "lastName", "phoneNumber"
            FROM "Account" INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
            WHERE "Account"."accountId" = "Auction"."sellerAccountId"
        ) AS seller
    ) AS seller,
    (
        SELECT row_to_json(product)
        FROM (
            SELECT "productId", "name", "description",
            (
                SELECT array_to_json(array_agg(row_to_json(image)))
                FROM (
                    SELECT "imageId", name, CONCAT ('${BUCKET.PUBLIC_URL}/',name) AS url
                    FROM "Image" AS image
                    WHERE image."productId" = "Product"."productId"
                ) AS image
            ) AS images,
            (
                SELECT row_to_json("Category")
                FROM "Category"
                WHERE "Category"."categoryId" = "Product"."categoryId"
            ) AS category
            FROM "Product"
            WHERE "Product"."productId" = "Auction"."productId"
        ) AS product
    ) AS product,
    (
        SELECT row_to_json(bid)
        FROM (
            SELECT "accountId", "firstName", "lastName", "phoneNumber", price, timestamp
            FROM "BidHistory"
            INNER JOIN "Account" ON "Account"."accountId" = "BidHistory"."bidderAccountId"
            INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
            WHERE "BidHistory"."auctionId" = "Auction"."auctionId"
            ORDER BY price DESC
            LIMIT 1
        ) AS bid
    ) AS "highestBidder",
    (
        SELECT count("BidHistory"."bidHistoryId")
        FROM "BidHistory"
        WHERE "BidHistory"."auctionId" = "Auction"."auctionId"
    ) AS "bids"
    FROM "Auction"
    WHERE $1 OR "productId" = ANY($2::bigint[])`;
    let params = [!auctionIds, auctionIds];
    DB.query(sql, params)
      .then((result) => {
        let auctions = result.rows;
        auctions = auctions.map((e) => {
          if (auctionInfos.has(e.auctionId))
            e.timeLeft = timeLeftFormat(auctionInfos.get(e.auctionId).timeLeft);
          return e;
        });
        resolve(auctions);
      })
      .catch(reject)
  });
};

var getAuction = (auctionId) => {
  let sql = `
    SELECT "Auction".*,
    (
      SELECT row_to_json(product)
      FROM (
        SELECT "Product"."productId", "Product"."name", "Product"."description",
        (
          SELECT array_to_json(array_agg(row_to_json(image)))
          FROM (
            SELECT "imageId", name, CONCAT ('${BUCKET.PUBLIC_URL}/',name) AS url
            FROM "Image"
            WHERE "Image"."productId" = "Product"."productId"
          ) AS image
        ) AS images,
        (
          SELECT row_to_json("Category")
          FROM "Category"
          WHERE "Category"."categoryId" = "Product"."categoryId"
        ) AS category
        FROM "Product"
        WHERE "Product"."productId" = "Auction"."productId"
      ) AS product
    ) AS product,
    (
      SELECT row_to_json(bid)
      FROM (
        SELECT "Account"."accountId", "Profile"."firstName", "Profile"."lastName",
        "Profile"."phoneNumber", "BidHistory".price, "BidHistory".timestamp
        FROM "BidHistory"
        INNER JOIN "Account" ON "Account"."accountId" = "BidHistory"."bidderAccountId"
        INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
        WHERE "BidHistory"."auctionId" = "Auction"."auctionId"
        ORDER BY price DESC
        LIMIT 1
      ) AS bid
    ) AS "highestBidder",
    (
      SELECT row_to_json("UserLevel")
      FROM "UserLevel"
      WHERE "UserLevel"."userLevelId" = "Auction"."allowedUserLevel"
    ) AS "allowedUserLevel",
    (
      SELECT count("BidHistory"."bidHistoryId")
      FROM "BidHistory"
      WHERE "BidHistory"."auctionId" = "Auction"."auctionId"
    ) AS "bids"
    FROM "Auction"
    WHERE "Auction"."auctionId" = $1
  `;
  return new Promise((resolve, reject) => {
    let params = [auctionId];
    DB.query(sql, params)
      .then(results => {
        if (results.rowCount > 0) {
          resolve(results.rows[0]);
        } else {
          reject({
            status: 500,
            error: ERROR[500][1]
          });
        }
      })
      .catch(error => reject(error));
  });
}

var active = (auctionId, adminId) => {
  let sql = `
    WITH activeResult AS (
      UPDATE "Auction"
      SET state = 1, "activatedDate" = now(), "activatedAdminId" = $2
      WHERE "Auction"."auctionId" = $1 AND state = 0
      RETURNING "sellerAccountId"
    )
    SELECT * FROM activeResult
  `;
  let params = [auctionId, adminId];
  return new Promise((resolve, reject) => {
    DB.query(sql, params)
      .then(results => {
        if (results.rowCount > 0) {
          resolve(results.rows[0].sellerAccountId);
          loadAuctions();
        } else {
          reject({
            status: 500,
            error: ERROR[500][1]
          });
        }
      })
      .catch(error => reject(error));
  });
}

var getMyAuctionIds = (accountId) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT "auctionId", state
      FROM "Auction"
      WHERE "Auction"."sellerAccountId" = $1
      ORDER BY "createdDate" DESC
    `;
    let params = [accountId];
    DB.query(sql, params)
      .then(result => resolve(result.rows))
      .catch(error => reject(error))
  });
};

var getAtendedAuctionIds = (accountId) => {
  return new Promise((resolve, reject) => {
    let sql = `
      WITH "bids" AS (
        SELECT *
        FROM "BidHistory" WHERE "bidderAccountId" = $1
        ORDER BY timestamp DESC
      ),
      auctions AS (
        SELECT "auctionId", state
        FROM "Auction"
        WHERE "Auction"."auctionId" IN (SELECT DISTINCT "auctionId" FROM "bids")
      )
      SELECT * FROM auctions
    `;
    let params = [accountId];
    DB.query(sql, params)
      .then(value => resolve(value.rows))
      .catch(reason => reject(reason));
  });
}

var insertAuction = (
  productName, description, searchKey, categoryId,
  productImages,
  duration, startPrice, ceilingPrice,
  bidIncreasement, comment,
  productReturningAddress, accountId,
  moneyReceivingBankRefId, moneyReceivingAddress, allowedUserLevel
) => {
  return new Promise((resolve, reject) => {
    let sql = `WITH
        "insertProductResult" AS (
            INSERT INTO "Product"(name,description,"searchKey","categoryId")
            VALUES ($1,$2,$3,$4)
            RETURNING "productId"),
        "insertImageResult" AS (
            INSERT INTO "Image"(name,"productId")
            VALUES (unnest($5::text[]),(SELECT "productId" FROM "insertProductResult"))
            RETURNING name),
        "insertAuctionResult" AS (
            INSERT INTO "Auction"(
                "createdDate", "activatedDate", duration, "startPrice", "ceilingPrice",
                "bidIncreasement", comment, state,
                "productId", "sellerAccountId",
                "shippingAddress", "shippingTypeId", "shippingFeeId",
                "moneyReceivingBankRefId", "moneyReceivingAddress", "allowedUserLevel")
            VALUES(
                now(),now(),$6,$7,$8,
                $9,$10,0,
                (SELECT "productId" FROM "insertProductResult"),$11,
                $12,$13,null,
                $14,$15,$16)
            RETURNING "auctionId")
        SELECT * FROM "insertAuctionResult"`
    let params = [
      productName, description, searchKey, categoryId,
      productImages,
      duration, startPrice, ceilingPrice,
      bidIncreasement, comment,
      accountId,
      productReturningAddress ? productReturningAddress : null, productReturningAddress ? 1 : null,
      moneyReceivingBankRefId, moneyReceivingAddress, allowedUserLevel
    ];
    DB.query(sql, params)
      .then(value => {
        if (value.rowCount > 0) {
          resolve();
          loadAuctions();
        } else
          reject({
            status: 500,
            error: ERROR[500][1]
          });
      })
      .catch(reason => {
        reject(reason);
      })
  })
}

var closeAuction = (auctionId, accountId, isAdmin) => {
  return new Promise((resolve, reject) => {
    if (auctionInfos.has(auctionId)) {
      let sql = `UPDATE "Auction" SET state=3, "manualClosedUserId"=$2 WHERE "auctionId"=$1 AND $3`;
      let params = [auctionId, accountId, isAdmin];
      DB.query(sql, params)
        .then((result) => {
          if (result.rowCount > 0) {
            if (auctionInfos.has(auctionId))
              auctionInfos.get(auctionId).timeLeft = 0;
            resolve();
          } else {
            reject({
              status: 500,
              error: ERROR[500][1]
            });
          }
        })
        .catch(reject)
    } else {
      let sql = `
        WITH deleteAuctionResult AS (
          DELETE FROM "Auction"
          WHERE state=0 AND "auctionId"=$1 AND ("sellerAccountId"=$2 OR $3)
          RETURNING "auctionId", "productId", "sellerAccountId"
        ), deleteProductResult AS (
          DELETE FROM "Product"
          WHERE "productId" = (SELECT "productId" FROM deleteAuctionResult)
        ), deleteImageResult AS (
          DELETE FROM "Image"
          WHERE "productId" = (SELECT "productId" FROM deleteAuctionResult)
        )
        SELECT * FROM deleteAuctionResult
      `;
      let params = [auctionId, accountId, isAdmin];
      DB.query(sql, params)
        .then((result) => {
          if (result.rowCount > 0) {
            console.log(`delete auction : ${auctionId}`);
            resolve(result.rows[0].sellerAccountId);
          } else {
            reject({
              status: 500,
              error: ERROR[500][1]
            });
          }
        })
        .catch(reject)
    }
  });
}

var buyNow = (auctionId) => {
  if (auctionInfos.has(auctionId))
    auctionInfos.get(auctionId).timeLeft = 0
}

var updateAuction = (auctionId, body, accountId, isAdmin) => {
  if (body.state) delete body.state;
  let keys = Object.keys(body);
  let keysExp = keys.map(e => `"${e}"`).join(',');
  let valuesExp = keys.map((v, i) => `$${i + 1}`).join(',');
  let sql = `
    UPDATE "Auction" SET (${keysExp})=(${valuesExp})
    WHERE "auctionId" = $${keys.length + 1} AND state = 0 AND ("sellerAccountId" = $${keys.length + 2} OR $${keys.length + 3})
  `;
  let params = keys.map(k => body[k]).concat(auctionId, accountId, isAdmin);
  return new Promise((resolve, reject) => {
    DB.query(sql, params)
      .then((value) => {
        if (value.rowCount > 0) {
          console.log(`update auction : ${auctionId}`);
          resolve();
        } else {
          reject({
            status: 500,
            error: ERROR[500][1]
          });
        }
      })
      .catch(reject)
  });
}

var selectAuctions = (page, categoryId, accountId) => {
  if (page == undefined) return Promise.resolve([]);
  return new Promise((resolve) => {
    let keys = Array();
    auctionInfos.forEach((v, k) => {
      if (!categoryId || categoryId < 0 || (v.categoryId == categoryId))
        keys.push(k);
    });
    getAll(keys)
      .then((auctions) => resolve(auctions.slice(0, page * 10 + 10)))
      .catch((reason) => {
        resolve([]);
        console.log(reason);
      });
  });
};

var selectMyAuctions = (page, auctionIds) => {
  if (page == undefined) return Promise.resolve([]);
  return new Promise((resolve) => {
    getAll(auctionIds)
      .then((auctions) => resolve({
        auctions: auctions.slice(0, page * 10 + 10),
        isExistClosed
      }))
      .catch((reason) => {
        resolve([]);
        console.log(reason);
      });
  });
};

var selectSearchAuctions = (page, categoryId, searchKey) => {
  if (page == undefined) return Promise.resolve([]);
  return new Promise((resolve) => {
    let keys = Array();
    searchKey = searchKey ? latinize(searchKey).toLowerCase() : '';
    auctionInfos.forEach((v, k) => {
      if (
        (!categoryId || categoryId < 0 || (v.categoryId == categoryId)) &&
        v.searchKeys.indexOf(searchKey) >= 0
      )
        keys.push(k);
    });
    keys = keys.sort((a, b) => {
      let aResult = auctionInfos.get(a).searchKeys.indexOf(searchKey);
      let bResult = auctionInfos.get(b).searchKeys.indexOf(searchKey);
      return bResult < aResult;
    });
    getAll(keys)
      .then((auctions) => resolve(auctions.slice(0, page * 10 + 10)))
      .catch((reason) => {
        resolve([]);
        console.log(reason);
      });
  });
}

var selectAuctionTimeleft = (auctionId) => {
  if (auctionInfos.has(auctionId))
    return auctionInfos.get(auctionId).timeLeft;
  return undefined;
}

module.exports = {
  loadAuctions,
  getAll,
  getAuction,
  getMyAuctionIds,
  getAtendedAuctionIds,
  active,
  insertAuction,
  buyNow,
  closeAuction,
  updateAuction,
  selectAuctions,
  selectMyAuctions,
  selectSearchAuctions,
  selectAuctionTimeleft
}
const { timeLeftFormat } = require('../helpers/time');
const { query } = require('../helpers/db');
const { DOMAIN_NAME, BUCKET } = require('../config');
const ERROR = require('../error.json');
const latinize = require('latinize');

var auctions = [],
    auctionsTimeLeft = {},
    closedAuctions = [];
loadAuctions();
setInterval(() => countDown(), 1000);

function countDown() {
    closedAuctions = [];
    for (var i = auctions.length - 1; i >= 0; i--) {
        let element = auctions[i];
        let timeLeft = auctionsTimeLeft[element.auctionId];
        if (timeLeft > 0) {
            timeLeft--;
            auctionsTimeLeft[element.auctionId] = timeLeft;
            element.timeLeft = timeLeftFormat(timeLeft);
        }
        else {
            closedAuctions.push(element);
            let auctionId = element.auctionId;
            delete auctionsTimeLeft[auctionId];
            auctions.splice(i, 1);
            let sql = `UPDATE "Auction" SET state=2 WHERE "auctionId"=$1`;
            let params = [auctionId];
            query(sql, params)
                .then(value => {
                    console.log(`close auction : ${auctionId}`);
                })
                .catch(reason => {
                    console.log(`fail to close auction : ${auctionId}`);
                })
        }
    }
}

function loadAuctions() {
    let sql = `SELECT "Auction"."auctionId", "Auction"."createdDate", "Auction"."activatedDate",
    "Auction"."duration", "Auction"."startPrice", "Auction"."ceilingPrice", "Auction"."bidIncreasement",
    (
        SELECT row_to_json(seller)
        FROM (
            SELECT "Account"."accountId", "Profile"."firstName", "Profile"."lastName", "Profile"."phoneNumber"
            FROM "Account" INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
            WHERE "Account"."accountId" = "Auction"."sellerAccountId"
        ) AS seller
    ) AS seller,
    (
        SELECT row_to_json(product)
        FROM (
            SELECT "Product"."productId", "Product"."name", "Product"."description",
            (
                SELECT array_to_json(array_agg(row_to_json(image)))
                FROM (
                    SELECT "imageId", name, CONCAT ('${BUCKET.PUBLIC_URL}/',name) AS url
                    FROM "Image" AS image
                    WHERE image."productId" = "Product"."productId"
                ) AS image
            ) AS images,
            (
                SELECT row_to_json(category)
                FROM "Category" AS category
                WHERE category."categoryId" = "Product"."categoryId"
            ) AS category
            FROM "Product"
            WHERE "Product"."productId" = "Auction"."productId"
        ) AS product
    ) AS product,
    (
        SELECT row_to_json(bid)
        FROM (
            SELECT "Account"."accountId", "Profile"."firstName", "Profile"."lastName", "Profile"."phoneNumber",
            "BidHistory".price, "BidHistory".timestamp
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
    WHERE "Auction".state = 1`;
    let params = [];
    query(sql, params)
        .then(result => {
            delete auctions;
            auctions = [];
            let now = Date.now();
            result.rows.forEach((element, index) => {
                let auction = element;
                auctionsTimeLeft[auction.auctionId] = auction.duration * 60 * 60 - Math.floor((now - new Date(auction.activatedDate).getTime()) / 1000);
                auctions.push(auction);
            }, this);
            auctions.sort((a, b) => auctionsTimeLeft[a.auctionId] > auctionsTimeLeft[b.auctionId])
            console.log('loaded ' + result.rowCount + ' auctions');
        })
        .catch(error => {
            console.log(error);
        })
};

exports.getAuction = (auctionId) => {
    return new Promise((resolve, reject) => {
        let auction = auctions.find(e => e.auctionId === auctionId);
        if (auction) {
            resolve(auction);
        } else {
            let sql = `SELECT "Auction"."auctionId", "Auction"."createdDate", "Auction"."activatedDate",
                "Auction"."duration", "Auction"."startPrice", "Auction"."ceilingPrice",
                "Auction"."bidIncreasement", "Auction".state,
                (
                    SELECT row_to_json(product)
                    FROM (
                        SELECT "Product"."productId", "Product"."name", "Product"."description",
                        (
                            SELECT array_to_json(array_agg(row_to_json(image)))
                            FROM (
                                SELECT "imageId", name, CONCAT ('${BUCKET.PUBLIC_URL}/',name) AS url
                                FROM "Image" AS image
                                WHERE image."productId" = "Product"."productId"
                            ) AS image
                        ) AS images,
                        (
                            SELECT row_to_json(category)
                            FROM "Category" AS category
                            WHERE category."categoryId" = "Product"."categoryId"
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
                    SELECT count("BidHistory"."bidHistoryId")
                    FROM "BidHistory"
                    WHERE "BidHistory"."auctionId" = "Auction"."auctionId"
                ) AS "bids"
                FROM "Auction"
                WHERE "Auction"."auctionId" = $1
                ORDER BY "createdDate" DESC`;
            let params = [auctionId];
            query(sql, params)
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
        }
    });
}

exports.active = (auctionId, adminId) => {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE "Auction"
                SET state = 1, "activatedDate" = now(), activatedAdminId = $2
                WHERE "Auction"."auctionId" = $1`;
        let params = [auctionId, adminId];
        query(sql, params)
            .then(results => {
                if (results.rowCount > 0) {
                    resolve();
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

exports.getMyAuctions = (accountId, states) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT "Auction"."auctionId", "Auction"."createdDate", "Auction"."activatedDate",
        "Auction"."duration", "Auction"."startPrice", "Auction"."ceilingPrice",
        "Auction"."bidIncreasement", "Auction".state,
        (
            SELECT row_to_json(product)
            FROM (
                SELECT "Product"."productId", "Product"."name", "Product"."description",
                (
                    SELECT array_to_json(array_agg(row_to_json(image)))
                    FROM (
                        SELECT "imageId", name, CONCAT ('${BUCKET.PUBLIC_URL}/',name) AS url
                        FROM "Image" AS image
                        WHERE image."productId" = "Product"."productId"
                    ) AS image
                ) AS images,
                (
                    SELECT row_to_json(category)
                    FROM "Category" AS category
                    WHERE category."categoryId" = "Product"."categoryId"
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
            SELECT count("BidHistory"."bidHistoryId")
            FROM "BidHistory"
            WHERE "BidHistory"."auctionId" = "Auction"."auctionId"
        ) AS "bids"
        FROM "Auction"
        WHERE "Auction"."sellerAccountId" = $1 AND "Auction".state = ANY($2::smallint[])
        ORDER BY "createdDate" DESC`;
        let params = [accountId, states];
        query(sql, params)
            .then(result => {
                resolve(result.rows)
            })
            .catch(error => reject(error))
    });
};

exports.getAtendedAuctions = (accountId) => {
    return new Promise((resolve, reject) => {
        let sql = `WITH "latestBids" AS (
            SELECT *
            FROM "BidHistory" WHERE "bidderAccountId" = $1
            ORDER BY timestamp DESC
        ),
        auctions AS (
            SELECT "Auction"."auctionId", "Auction"."createdDate", "Auction"."activatedDate",
                "Auction"."duration", "Auction"."startPrice", "Auction"."ceilingPrice",
                "Auction"."bidIncreasement", "Auction".state,
                (
                    SELECT row_to_json(seller)
                    FROM (
                        SELECT "Account"."accountId", "Profile"."firstName", "Profile"."lastName", "Profile"."phoneNumber"
                        FROM "Account" INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
                        WHERE "Account"."accountId" = "Auction"."sellerAccountId"
                    ) AS seller
                ) AS seller,
                (
                    SELECT row_to_json(product)
                    FROM (
                        SELECT "Product"."productId", "Product"."name", "Product"."description",
                        (
                            SELECT array_to_json(array_agg(row_to_json(image)))
                            FROM (
                                SELECT "imageId", name, CONCAT ('${BUCKET.PUBLIC_URL}/',name) AS url
                                FROM "Image" AS image
                                WHERE image."productId" = "Product"."productId"
                            ) AS image
                        ) AS images,
                        (
                            SELECT row_to_json(category)
                            FROM "Category" AS category
                            WHERE category."categoryId" = "Product"."categoryId"
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
                    SELECT count("BidHistory"."bidHistoryId")
                    FROM "BidHistory"
                    WHERE "BidHistory"."auctionId" = "Auction"."auctionId"
                ) AS "bids"
                FROM "Auction"
                WHERE "Auction"."auctionId" IN (SELECT DISTINCT "auctionId" FROM "latestBids")
            )
        SELECT * FROM auctions`;
        let params = [accountId];
        query(sql, params)
            .then(value => resolve(value.rows))
            .catch(reason => reject(reason));
    });
}

exports.insertAuction = (
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
        query(sql, params)
            .then(value => {
                if (value.rowCount > 0) {
                    resolve();
                    loadAuctions();
                }
                else
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

exports.bid = (auctionId, accountId, price, buyNow) => {
    return new Promise((resolve, reject) => {
        var index, auction;
        auction = auctions.find((e, i) => {
            if (e.auctionId == auctionId) {
                index = i;
                return true;
            }
        });
        if (!auction) return reject({
            status: 400,
            error: ERROR[400][50]
        });
        if (auction.highestBidder && auction.highestBidder.price >= price) return reject({
            status: 400,
            error: ERROR[400][51]
        });
        var sql = `
        WITH "latestBid" AS (
            INSERT INTO "BidHistory"(timestamp,price,"auctionId","bidderAccountId")
            VALUES (now(),$1,$2,$3)
            RETURNING "bidderAccountId", price, timestamp
        )${buyNow ? `, auction AS (
            UPDATE "Auction" SET state = 3
            WHERE "auctionId"=$2
            RETURNING "auctionId"
        )`: ''}
        SELECT row_to_json(bid) AS "highestBidder"
        FROM (
            SELECT
            "Account"."accountId",
            "Profile"."firstName",
            "Profile"."lastName",
            "Profile"."phoneNumber",
            "latestBid".price,
            "latestBid".timestamp
            FROM "latestBid"
            INNER JOIN "Account" ON "Account"."accountId" = "latestBid"."bidderAccountId"
            INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
        ) AS bid`,
            params = [price, auctionId, accountId];
        query(sql, params)
            .then(result => {
                if (result.rowCount > 0) {
                    if (buyNow) {
                        let auctionIndex = auctions.findIndex(e => e.auctionId === auctionId);
                        delete auctionsTimeLeft[auctionId];
                        auctions.splice(auctionIndex, 1);
                        console.log(`close auction : ${auctionId}`);
                        resolve();
                    }
                    else {
                        auction.highestBidder = result.rows[0].highestBidder;
                        let page = Math.floor(index / 10) + 1;
                        categoryId = auction.product.category.categoryId;
                        pageInCategory = Math.floor(auctions.filter(e => e.product.category.categoryId == categoryId).indexOf(auction) / 10) + 1;
                        resolve({ auction, page, categoryId, pageInCategory });
                    }
                }
                else {
                    reject({
                        status: 500,
                        error: ERROR[500][1]
                    });
                }
            })
            .catch(error => {
                reject(error);
            })
    })
}

exports.buyNow = (accountId, auctionId) => {
    return new Promise((resolve, reject) => {
        var index, auction;
        auction = auctions.find((e, i) => {
            if (e.auctionId == auctionId) {
                index = i;
                return true;
            }
        });
        if (!auction) return reject({
            status: 400,
            error: ERROR[400][50]
        });
        if (auction.highestBidder && auction.highestBidder.price >= price) return reject({
            status: 400,
            error: ERROR[400][51]
        });
        var sql = `
            WITH auction AS (
                UPDATE "Auction" SET state = 3
                WHERE "auctionId"=$1
                RETURNING "auctionId"
            ),
            "latestBid" AS (
                INSERT INTO "BidHistory"(timestamp,price,"auctionId","bidderAccountId")
                VALUES (now(),(SELECT "ceilingPrice" FROM auction),$1,$2)
                RETURNING "bidderAccountId", price, timestamp
            )
            SELECT * FROM "latestBid"
        `,
            params = [auctionId, accountId];
        query(sql, params)
            .then(result => {
                if (result.rowCount > 0) {
                    let auctionIndex = auctions.findIndex(e => e.auctionId === auctionId);
                    delete auctionsTimeLeft[auctionId];
                    auctions.splice(auctionIndex, 1);
                    console.log(`close auction : ${auctionId}`);
                    resolve();
                }
                else {
                    reject({
                        status: 500,
                        error: ERROR[500][1]
                    });
                }
            })
            .catch(error => {
                reject(error);
            })
    })
}

exports.closeAuction = (auctionId, accountId, isAdmin) => {
    return new Promise((resolve, reject) => {
        let element = auctions.find(e => e.auctionId === auctionId);
        if (element) {
            let sql = `UPDATE "Auction" SET state=3 WHERE "auctionId"=$1 AND ("sellerAccountId"=$2 OR $3)`;
            let params = [auctionId, sellerAccountId, isAdmin];
            query(sql, params)
                .then(value => {
                    if (value.rowCount > 0) {
                        closedAuctions.push(element);
                        let auctionId = element.auctionId;
                        delete auctionsTimeLeft[auctionId];
                        auctions.splice(i, 1);
                        console.log(`close auction : ${auctionId}`);
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
            let sql = `WITH deleteAuctionResult AS (
                DELETE FROM "Auction"
                WHERE state=0 AND "auctionId"=$1 AND ("sellerAccountId"=$2 OR $3)
                RETURNING "auctionId", "productId"
            ), deleteProductResult AS (
                DELETE FROM "Product"
                WHERE "productId" = (SELECT "productId" FROM deleteAuctionResult)
            ), deleteImageResult AS (
                DELETE FROM "Image"
                WHERE "productId" = (SELECT "productId" FROM deleteAuctionResult)
            )
            SELECT * FROM deleteAuctionResult`;
            let params = [auctionId, sellerAccountId, isAdmin];
            query(sql, params)
                .then(value => {
                    if (value.rowCount > 0) {
                        console.log(`delete auction : ${auctionId}`);
                        resolve();
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

exports.selectAuctions = (page, categoryId, accountId, attendedIds) => {
    if (page == undefined) return [];
    let results = [...auctions];
    if (categoryId && categoryId > 0) results = results.filter(e => e.product.category.categoryId == categoryId);
    results = results.slice(0, page * 10 + 9);
    return results;
};

exports.selectAttendedAuctions = (page, attendedIds) => {
    if (page == undefined) return [];
    let result = { auctions, closedAuctions }
    if (attendedIds && attendedIds.length > 0) result.auctions = result.auctions.filter(e => attendedIds.indexOf(e.auctionId) >= 0);
    result.auctions = result.auctions.slice(0, page * 10 + 9);
    return result;
};

exports.selectMyAuctions = (page, accountId) => {
    if (page == undefined) return [];
    let result = { auctions, closedAuctions }
    if (accountId && accountId > 0) result.auctions = result.auctions.filter(e => e.seller.accountId == accountId);
    result.auctions = result.auctions.slice(0, page * 10 + 9);
    return result;
};

exports.selectSearchAuctions = (page, categoryId, searchKey) => {
    let results = [...auctions];
    if (categoryId && categoryId > 0) results = results.filter(e => e.product.category.categoryId == categoryId);
    if (searchKey) {
        searchKey = latinize(searchKey).toLowerCase();
        results = results.filter(e => {
            e = latinize(e.product.name).toLowerCase();
            return e.indexOf(searchKey) >= 0;
        });
        results = results.sort((a, b) => {
            let aResult = 1 - a.product.name.toLowerCase().indexOf(searchKey);
            let bResult = 1 - b.product.name.toLowerCase().indexOf(searchKey);
            return bResult > aResult;
        });
    }
    return results.slice(0, page * 10 + 9);
}

// var sql = `UPDATE "Auction" SET state = 1, "activatedDate" = now()`;
// var params = []
// query(sql,params)
// .then(result => {
//     console.log(result);
// })
// .catch(error => {
//     console.log(error);
// })

const { timeLeftFormat } = require('../helpers/time'),
      { query } = require('../helpers/db'),
      { DOMAIN_NAME } = require('../config'),
      ERROR = require('../error.json');

var auctions = [],
    auctionsTimeLeft = {},
    closedAuctions = [];
loadAuctions();
setInterval(() => countDown(), 1000);

function countDown() {
    closedAuctions = [];
    for (var i = auctions.length - 1; i >= 0; i--) {
        var element = auctions[i],
            timeLeft = auctionsTimeLeft[element.auctionId];
        if (timeLeft > 0) {
            timeLeft--;
            auctionsTimeLeft[element.auctionId] = timeLeft;
            element.timeLeft = timeLeftFormat(timeLeft);
        }
        else {
            closedAuctions.push(element);
            let auctionId = element.auctionId;
            delete auctionsTimeLeft[auctionId];
            delete auctions[i];
            let sql = `UPDATE "Auction" SET state=2 WHERE "auctionId"=$1`;
            let params = [auctionId];
            query(sql,params)
            .then(value => {
                console.log(`close auction : ${auctionId}`);
            })
            .catch(reason => {
                console.log(`fail to close auction : ${auctionId}`);
            })
        }
    }
}

function loadAuctions () {
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
                    SELECT "imageId", name, CONCAT ('${DOMAIN_NAME}/images/product/',name) AS url
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
    query(sql,params)
    .then(result => {
        delete auctions;
        auctions = [];
        let now = Date.now();
        result.rows.forEach((element, index) => {
            let auction = element;
            auctionsTimeLeft[auction.auctionId] = auction.duration*60*60 - Math.floor((now - new Date(auction.activatedDate).getTime())/1000);
            auctions.push(auction);
        }, this);
        auctions.sort((a,b) => auctionsTimeLeft[a.auctionId] > auctionsTimeLeft[b.auctionId])
        console.log('loaded ' + result.rowCount + ' auctions');
    })
    .catch(error => {
        console.log(error);
    })
};

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
                        SELECT "imageId", name, CONCAT ('${DOMAIN_NAME}/images/product/',name) AS url
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
        query(sql,params)
        .then(result => {
            resolve(result.rows)
        })
        .catch(error => reject(error) )
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
                    SELECT row_to_json(product)
                    FROM (
                        SELECT "Product"."productId", "Product"."name", "Product"."description",
                        (
                            SELECT array_to_json(array_agg(row_to_json(image)))
                            FROM (
                                SELECT "imageId", name, CONCAT ('${DOMAIN_NAME}/images/product/',name) AS url
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
                WHERE "Auction"."auctionId" IN (SELECT DISTINCT "auctionId" FROM "latestBids")}
            )
        SELECT * FROM auctions`;
        let params = [accountId];
        query(sql,params)
        .then(value => resolve(value.rows))
        .catch(reason => reject(reason));
    });
}

exports.getAuctions = (page, categoryId, accountId, attendedIds) => {
    if (page == undefined) return [];
    let result = { auctions, closedAuctions }
    if (attendedIds && attendedIds.length > 0) result.auctions = result.auctions.filter(e => attendedIds.indexOf(e.auctionId) >= 0);
    if (accountId && accountId > 0) result.auctions = result.auctions.filter(e => e.seller.accountId === accountId);
    if (categoryId && categoryId > 0) result.auctions = result.auctions.filter(e => e.product.category.categoryId == categoryId);
    result.auctions = result.auctions.slice(0, page*10 + 9);
    return result;
};

exports.insertAuction = (
    productName, description, searchKey, categoryId,
    productImages,
    duration, startPrice, ceilingPrice,
    bidIncreasement, comment,
    productReturningAddress, accountId,
    moneyReceivingBankRefId, moneyReceivingAddress, allowedUserLevel
) => {
    return new Promise((resolve,reject) => {
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
                "shippingAddress", "shippingType", "shippingFee",
                "moneyReceivingBankRefId", "moneyReceivingAddress", "allowedUserLevel")
            VALUES(
                now(),now(),$6,$7,$8,
                $9,$10,1,
                (SELECT "productId" FROM "insertProductResult"),$12,
                $11,$13,
                $14,$15,$16)
            RETURNING "auctionId")
        SELECT * FROM "insertAuctionResult"`
        let params = [
            productName, description, searchKey, categoryId,
            productImages,
            duration, startPrice, ceilingPrice,
            bidIncreasement, comment,
            accountId,
            productReturningAddress?productReturningAddress:null, productReturningAddress?2:null, null,
            moneyReceivingBankRefId, moneyReceivingAddress, allowedUserLevel
        ];
        query(sql,params)
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
    return new Promise((resolve,reject) => {
        var index, auction;
        auction = auctions.find((e,i) => {
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
        )${buyNow?`, auction AS (
            UPDATE "Auction" SET state = 3
            WHERE "auctionId"=$1
            RETURNING "auctionId"
        )`:''}
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
        params = [price,auctionId,accountId];
        query(sql,params)
        .then(result => {
            if (result.rowCount > 0) {
                if (buyNow) {
                    let auctionIndex = auctions.findIndex(e => e.auctionId === auctionId);
                    delete auctionsTimeLeft[auctionId];
                    auctions.splice(auctionIndex,1);
                    console.log(`close auction : ${auctionId}`);
                    resolve();
                }
                else {
                    auction.highestBidder = result.rows[0].highestBidder;
                    let page = Math.floor(index/10) + 1;
                        categoryId = auction.product.category.categoryId;
                        pageInCategory = Math.floor(auctions.filter(e => e.product.category.categoryId == categoryId).indexOf(auction)/10) + 1;
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

// var sql = `INSERT INTO "PayPostFee"(ratio,fixed,"issuedTimestamp",maximum) VALUES(unnest($1::real[]),unnest($2::real[]),now(),unnest($3::integer[]))`;
// var params = [
//     [null,null,null,null,0.01],
//     [13.636,30,50,65.454,65.454],
//     [500,1000,2000,3000,null]
// ]
// query(sql,params)
// .then(result => {
//     console.log(result);
// })
// .catch(error => {
//     console.log(error);
// })
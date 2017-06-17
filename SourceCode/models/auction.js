const { timeLeftFormat } = require('../helpers/time'),
      { query } = require('../helpers/db'),
      { DOMAIN_NAME } = require('../config'),
      ERROR = require('../error.json');

var auctions = [],
    auctionsTimeLeft = {};
loadAuctions();
setInterval(() => countDown(), 1000);

function countDown() {
    for (var i = auctions.length - 1; i >= 0; i--) {
        var element = auctions[i],
            timeLeft = auctionsTimeLeft[element.auctionId];
        if (timeLeft > 0) {
            timeLeft--;
            auctionsTimeLeft[element.auctionId] = timeLeft;
            element.timeLeft = timeLeftFormat(timeLeft);
        }
        else {
            let auctionId = element.auctionId;
            delete auctionsTimeLeft[auctionId];
            delete auctions[i];
            let sql = `UPDATE "Auction" SET state=0 WHERE "auctionId"=$1`;
            let params = [auctionId];
            query(sql,params)
            .then(value => {
                console.log(`close auction : ${auctionId}`);
            })
            .catch(reason => {
                console.log(`failed to close auction : ${auctionId}`);
            })
        }
    }
}

function loadAuctions () {
    let now = Date.now();
    let sql = `
            SELECT row_to_json(auction)
            FROM (
                SELECT
                "Auction"."auctionId",
                "Auction"."createdDate",
                "Auction"."activatedDate",
                "Auction"."duration",
                "Auction"."startPrice",
                "Auction"."ceilingPrice",
                "Auction"."bidIncreasement",
                (
                    SELECT row_to_json(seller)
                    FROM (
                        SELECT
                        "Account"."accountId",
                        "Profile"."firstName",
                        "Profile"."lastName",
                        "Profile"."phoneNumber"
                        FROM "Account" INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
                        WHERE "Account"."accountId" = "Auction"."sellerAccountId"
                    ) AS seller
                ) AS seller,
                (
                    SELECT row_to_json(product)
                    FROM (
                        SELECT
                        "Product"."productId",
                        "Product"."name",
                        "Product"."description",
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
                        SELECT
                        "Account"."accountId",
                        "Profile"."firstName",
                        "Profile"."lastName",
                        "Profile"."phoneNumber",
                        "BidHistory".price,
                        "BidHistory".timestamp
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
            ) AS auction
        `,
        params = [];
    query(sql,params)
    .then(result => {
        result.rows.forEach((element, index) => {
            let auction = element.row_to_json,
                page = Math.floor(index/20);
            auctionsTimeLeft[auction.auctionId] = auction.duration*60*60 - Math.floor((Date.now() - new Date(auction.activatedDate).getTime())/1000);
            auctions.push(auction);
        }, this);
        console.log('loaded ' + result.rowCount + ' auctions');
    })
    .catch(error => {
        console.log(error);
    })
};

exports.getAuctions = (page, categoryId) => {
    if (page !== undefined) {
        if (categoryId && categoryId === -1)
            return auctions.slice(0, page*10 + 9);
        else {
            return auctions.filter(e => { return e.product.category.categoryId == categoryId }).slice(0, page*10 + 9);
        }
    }
    return [];
};

exports.bid = (auctionId, accountId, price) => {
    return new Promise((resolve,reject) => {
        var index, auction;
        auction = auctions.find((e,i) => {
            if (e.auctionId == auctionId) {
                index = i;
                return true;
            }
        });
        if (!auction) return reject(new Error('auction does not exist'));
        if (auction.highestBidder && auction.highestBidder.price >= price) return reject(new Error('someone has bidded that price'));
        var sql = `
            WITH "latestBid" AS (
                INSERT INTO "BidHistory"(timestamp,price,"auctionId","bidderAccountId")
                VALUES (now(),$1,$2,$3)
                RETURNING "bidderAccountId", price, timestamp
            )
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
            ) AS bid
        `,
        params = [price,auctionId,accountId];
        query(sql,params)
        .then(result => {
            if (result.rowCount > 0) {
                auction.highestBidder = result.rows[0].highestBidder;
                let page = Math.floor(index/10) + 1;
                    categoryId = auction.product.category.categoryId;
                    pageInCategory = Math.floor(auctions.filter(e => e.product.category.categoryId == categoryId).indexOf(auction)/10) + 1;
                resolve({ auction, page, categoryId, pageInCategory });
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

exports.insertAuction = (
    productName, description, searchKey, categoryId,
    productImages,
    duration, startPrice, ceilingPrice,
    bidIncreasement, comment,
    productReturningAddress, accountId,
    moneyReceivingBankRefId, moneyReceivingAddress, allowedUserLevel
) => {
    return new Promise((resolve,reject) => {
        console.log(productImages);
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
                "productReturningAddress", "productId", "sellerAccountId",
                "moneyReceivingBankRefId", "moneyReceivingAddress", "allowedUserLevel")
            VALUES(
                now(),now(),$6,$7,$8,
                $9,$10,1,
                $11,(SELECT "productId" FROM "insertProductResult"),$12,
                $13,$14,$15)
            RETURNING "auctionId")
        SELECT * FROM "insertAuctionResult"`
        let params = [
            productName, description, searchKey, categoryId,
            productImages,
            duration, startPrice, ceilingPrice,
            bidIncreasement, comment,
            productReturningAddress, accountId,
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
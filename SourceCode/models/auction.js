var { timeLeftFormat } = require('../helpers/time'),
    { query } = require('../helpers/db'),
    { DOMAIN_NAME } = require('../config');

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
            delete auctionsTimeLeft[element.auctionId];
            delete auctions[i];
            // update state in database
            // reload auctions
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
                        ORDER BY price DESC
                        LIMIT 1
                    ) AS bid
                ) AS "highestBidder"
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

exports.getAuctions = (page) => {
    if (page !== undefined) return auctions.slice(0, page*10 + 9);
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
        if (auction.highestBidder.price >= price) return reject(new Error('someone has bidded that price'));
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
                resolve({ page: Math.ceil(index), auction });
            }
        })
        .catch(error => {
            reject(error);
        })
    })
}
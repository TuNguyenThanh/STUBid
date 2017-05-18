var config = require('../config'),
    { timeLeftFormat } = require('../helper/time'),
    { query } = require('../helper/db');

var auctions = [];
var auctionsTimeLeft = [];

exports.loadAuctions = () => {
    let now = Date.now();
    let sql = `
            SELECT row_to_json(auction)
            FROM (
                SELECT *,
                (
                    SELECT row_to_json(product)
                    FROM (
                        SELECT *, (
                            SELECT array_to_json(array_agg(row_to_json(image)))
                            FROM "Image" AS image
                            WHERE image."productId" = "Product"."productId"
                        ) AS images
                        FROM "Product"
                    ) AS product
                ) AS product,
                (
                    SELECT row_to_json(bid)
                    FROM (
                        SELECT
                        "BidHistory".timestamp,
                        "BidHistory".price,
                        (
                            SELECT row_to_json(bidder)
                            FROM (
                                SELECT
                                "Account"."accountId",
                                "Profile".*
                                FROM "Account" INNER JOIN "Profile" ON "Profile"."profileId" = "Account"."profileId"
                                WHERE "Account"."accountId" = "BidHistory"."bidderAccountId"
                            ) AS bidder
                        ) AS bidder
                        FROM "BidHistory"
                    ) AS bid
                ) AS "highestBid"
                FROM "Auction"
            ) AS auction
        `,
        params = [];
    query(sql,params)
    .then(result => {
        // console.log(result.rows);
        result.rows.forEach(function(element) {
            let auction = element.row_to_json;
            auctions.push(auction);
            auctionsTimeLeft[auction.auctionId] = (Date.now() - new Date(auction.activatedDate).getTime())/1000;
        }, this);
        console.log('loaded ' + result.rowCount + ' auctions');
        console.log(auctionsTimeLeft);
    })
    .catch(error => {
        console.log(error);
    })
}

exports.getAuctions = () => {
    for (var i = 0; i < auctions.length; i++) {
        var element = auctions[i],
            timeLeft = auctionsTimeLeft[element.id];
        if (timeLeft > 0) {
            timeLeft--;
            element.timeLeft = timeLeftFormat(timeLeft);
        }
    }
    return auctions;
}
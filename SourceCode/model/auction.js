var config = require('../config'),
    { timeLeftFormat } = require('../helper/time'),
    { query } = require('../helper/db'),
    { DOMAIN_NAME } = require('../config');

var auctions = [];
var auctionsTimeLeft = {};
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
            auctions.splice(i,1);
        }
    }
}

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
                            FROM (
                                SELECT "imageId", name
                                FROM "Image" AS image
                                WHERE image."productId" = "Product"."productId"
                            ) AS image
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
            auction.product.images.forEach(e => {
                e.url = `${DOMAIN_NAME}/image/product/${e.name}`
            })
            auctions.push(auction);
            auctionsTimeLeft[auction.auctionId] = auction.duration*60*60 - Math.floor((Date.now() - new Date(auction.activatedDate).getTime())/1000);
        }, this);
        console.log('loaded ' + result.rowCount + ' auctions');
    })
    .catch(error => {
        console.log(error);
    })
};

exports.getAuctions = () => {
    return auctions;
};
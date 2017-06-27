var socketEvents = [
    {
        "event-type": "on",
        "event-name": "'SERVER-UPDATE-AUCTION'",
        "data": [{
            "auctionId": "number",
            "createdDate": "string",
            "activatedDate": "string",
            "duration": "number",
            "startPrice": "number",
            "ceilingPrice": "number",
            "bidIncreasement": "number",
            "seller": {
                "accountId": "number",
                "firstName": "string",
                "lastName": "string",
                "phoneNumber": "string"
            },
            "product": {
                "productId": "number",
                "name": "string",
                "description": "string",
                "images": [{
                    "imageId": "number",
                    "name": "string",
                    "url": "string"
                }],
                "category": {
                    "categoryId": "number",
                    "name": "string",
                    "description": "string",
                    "createdDate": "string"
                }
            },
            "highestBidder": {
                "accountId": "number",
                "firstName": "string",
                "lastName": "string",
                "phoneNumber": "string",
                "price": "number",
                "timestamp": "string"
            },
            "bids": "number",
            "timeLeft": "string"
        }]
    },
    {
        "event-type": "on",
        "event-name": "SERVER-SEND-INFO",
        "data": {
            "page": "number",
            "category": "number"
        }
    },
    {
        "event-type": "emit",
        "event-name": "'CLIENT-SEND-CATEGORY'",
        "data": { "categoryId": "number" }
    },
    {
        "event-type": "emit",
        "event-name": "'CLIENT-SEND-PAGE'",
        "data": { "page": "number" }
    },
    {
        "event-type": "emit",
        "event-name": "'CLIENT-REQUEST-ATTENDED-AUCTIONS-VIEW'",
        "data": { "accountId": "number" }
    },
    {
        "event-type": "on",
        "event-name": "'SERVER-SEND-CLOSED-ATTENDED-AUCTIONS'",
        "data": [{
            "auctionId": "number",
            "createdDate": "string",
            "activatedDate": "string",
            "duration": "number",
            "startPrice": "number",
            "ceilingPrice": "number",
            "bidIncreasement": "number",
            "seller": {
                "accountId": "number",
                "firstName": "string",
                "lastName": "string",
                "phoneNumber": "string"
            },
            "product": {
                "productId": "number",
                "name": "string",
                "description": "string",
                "images": [{
                    "imageId": "number",
                    "name": "string",
                    "url": "string"
                }],
                "category": {
                    "categoryId": "number",
                    "name": "string",
                    "description": "string",
                    "createdDate": "string"
                }
            },
            "highestBidder": {
                "accountId": "number",
                "firstName": "string",
                "lastName": "string",
                "phoneNumber": "string",
                "price": "number",
                "timestamp": "string"
            },
            "bids": "number"
        }]
    },
    {
        "event-type": "emit",
        "event-name": "'CLIENT-REQUEST-MY-AUCTIONS-VIEW'",
        "data": { "accountId": "number" }
    },
    {
        "event-type": "on",
        "event-name": "'SERVER-SEND-MY-CLOSED-AUCTIONS'",
        "data": [{
            "auctionId": "number",
            "createdDate": "string",
            "activatedDate": "string",
            "duration": "number",
            "startPrice": "number",
            "ceilingPrice": "number",
            "bidIncreasement": "number",
            "product": {
                "productId": "number",
                "name": "string",
                "description": "string",
                "images": [{
                    "imageId": "number",
                    "name": "string",
                    "url": "string"
                }],
                "category": {
                    "categoryId": "number",
                    "name": "string",
                    "description": "string",
                    "createdDate": "string"
                }
            },
            "highestBidder": "null",
            "bids": "number"
        }]
    },
    {
        "event-type": "emit",
        "event-name": "'CLIENT-SEND-MY-AUCTIONS-PAGE'",
        "data": { "page": "number" }
    },
    {
        "event-type": "emit",
        "event-name": "'CLIENT-REQUEST-SEARCH-VIEW'",
        "data": {}
    },
    {
        "event-type": "emit",
        "event-name": "'CLIENT-SEND-SEARCH-KEY'",
        "data": {
            "searchKey": "string"
        }
    }
]
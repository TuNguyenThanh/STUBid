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
        "data": { "page": "number"}
    }
]
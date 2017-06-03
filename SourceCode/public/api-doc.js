var apiDoc = {
    "routes": [
        {
            "method": "post",
            "route": "/Accounts/register",
            "parameters": {
                "verifyCode": "string, required for verifying registration",
                "firstName": "string",
                "lastName": "string",
                "phoneNumber": "string",
                "email": "string",
                "username": "string",
                "password": "string"
            },
            "response": {
                "ok": "boolean",
                "step": "number"
            }
        },
        {
            "method": "post",
            "route": "/Accounts/resendVerifyCode",
            "parameters": {
                "phoneNumber": "string",
                "email": "string",
                "username": "string"
            },
            "response": { }
        },
        {
            "method": "post",
            "route": "/Accounts/login",
            "parameters": {
                "username": "string, required when token is empty",
                "password": "string, required when token is empty",
                "token": "string, required when username and password are empty"
            },
            "response": {
                "ok": "boolean",
                "token": "string",
                "profile": {
                    "firstName": "string",
                    "lastName": "string",
                    "phoneNumber": "string",
                    "email": "string",
                    "avatar":"string",
                    "bankRefNumber": "string",
                    "bankRefName": "string"
                }
            }
        },
        {
            "method": "post",
            "route": "/Accounts/forgotPassword",
            "parameters": {
                "email": "string"
            },
            "response": { }
        },
        {
            "method": "get",
            "route": "/Categorys",
            "parameters": { },
            "response": [{
                "categoryId": "number",
                "name": "string",
                "description": "string",
                "createdDate": "timestamp"
            }]
        },
        {
            "method": "patch",
            "route": "/Auctions/bid",
            "parameters": {
                "auctionId": "number",
                "accountId": "number",
                "price": "number"
            },
            "response": {
                "ok": "boolean"
            }
        }
    ],
    "socketEvents": [
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
}
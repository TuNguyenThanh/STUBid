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
            "response": {
                "success": "boolean"
            }
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
                    "bankRefs": [
                        {
                            "bankRefId": "number",
                            "bankRefNumber": "string",
                            "bankBrandName": "string",
                            "bankLogo": "string"
                        }
                    ]
                }
            }
        },
        {
            "method": "patch",
            "route": "/Accounts/changePassword",
            "parameters": {
                "token": "string",
                "currentPassword": "string",
                "newPassword": "string"
            },
            "response": {
                "success": "boolean",
                "token": "string"
            }
        },
        {
            "method": "patch",
            "route": "/Accounts/updateProfile",
            "parameters": {
                "token": "string",
                "firstName": "string",
                "lastName": "string",
                "phoneNumber": "string",
                "email": "string"
            },
            "response": {
                "success": "boolean",
                "token": "string"
            }
        },
        {
            "method": "patch",
            "route": "/Accounts/updateAvatar",
            "parameters": {
                "token": "string",
                "firstName": "file"
            },
            "response": {
                "success": "boolean",
                "avatar": "string",
                "token": "string"
            }
        },
        {
            "method": "post",
            "route": "/Accounts/forgotPassword",
            "parameters": {
                "email": "string"
            },
            "response": {
                "success": "boolean"
            }
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
                "token": "string",
                "auctionId": "number",
                "accountId": "number",
                "price": "number",
                "buyNow": "boolean"
            },
            "response": {
                "success": "boolean",
                "token": "string"
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
    ],
    "error": {
        "500": [
            {
                "code": 2000,
                "message": "Database connection error"
            },
            {
                "code": 2001,
                "message": "Database query error"
            },
            {
                "code": 2010,
                "message": "Can not send verification code via SMS"
            },
            {
                "code": 2011,
                "message": "Can not send verification code via email"
            },
            {
                "code": 2020,
                "message": "Form parsing failed"
            }
        ],
        "400": [
            {
                "code": 1000,
                "message": "Missing parameters"
            },
            {
                "code": 1001,
                "message": "Authentication token is not valid"
            },
            {
                "code": 1002,
                "message": "Authentication token has been expired"
            },
            {
                "code": 1010,
                "field": "email",
                "message": "Email has been taken"
            },
            {
                "code": 1011,
                "field": "phoneNumber",
                "message": "Phone number has been taken"
            },
            {
                "code": 1012,
                "field": "username",
                "message": "Username has been taken"
            },
            {
                "code": 1013,
                "message": "Verification code is not valid"
            },
            {
                "code": 1014,
                "message": "Registration has been expired"
            },
            {
                "code": 1020,
                "message": "Wong username or password"
            },
            {
                "code": 1021,
                "message": "Account has been banned at level 1"
            },
            {
                "code": 1022,
                "message": "Account has been banned at level 2"
            },
            {
                "code": 1030,
                "message": "Current password is not correct"
            },
            {
                "code": 1031,
                "message": ""
            },
            {
                "code": 1040,
                "message": "Email not found"
            }
        ]
    }
}
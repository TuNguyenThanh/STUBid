var routes = [
        {
            "method": "post",
            "route": "/Accounts/register",
            "parameterType": "application/json",
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
            "parameterType": "application/json",
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
            "parameterType": "application/json",
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
                    "bankRefs": {
                        "bankRefId": "number",
                        "bankAccountNumber": "string",
                        "bankBrandId": "number",
                        "bankBrandName": "string"
                    }
                }
            }
        },
        {
            "method": "patch",
            "route": "/Accounts/changePassword",
            "parameterType": "application/json",
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
            "parameterType": "application/json",
            "parameters": {
                "token": "string",
                "firstName": "string",
                "lastName": "string",
                "phoneNumber": "string",
                "email": "string",
                "bankRef": {
                    "bankRefId": "number, optional",
                    "bankAccountNumber": "string",
                    "bankBrandId": "number"
                }
            },
            "response": {
                "success": "boolean",
                "token": "string"
            }
        },
        {
            "method": "patch",
            "route": "/Accounts/updateAvatar",
            "parameterType": "FormData",
            "parameters": {
                "token": "string",
                "avatar": "file"
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
            "parameterType": "application/json",
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
            "response": [{
                "categoryId": "number",
                "name": "string",
                "description": "string",
                "createdDate": "timestamp"
            }]
        },
        {
            "method": "get",
            "route": "/BankBrands",
            "response": [{
                "bankBrandId": "number",
                "bankBrandName": "string",
                "bankLogo": "string"
            }]
        },
        {
            "method": "post",
            "route": "/Auctions/uploadProduct",
            "parameterType": "FormData",
            "parameters": {
                "token": "string",
                "productName": "string",
                "description": "string",
                "searchKey": "JSON array string, optional",
                "categoryId": "number",
                "duration": "number",
                "startPrice": "number",
                "ceilingPrice": "number, optional",
                "bidIncreasement": "number",
                "comment": "string, optional",
                "productReturningAddress": "string, optional",
                "moneyReceivingBankRefId": "number, optional",
                "moneyReceivingAddress": "string, optional",
                "allowedUserLevel": "number, optional",
                "image": "file"
            },
            "response": {
                "success": "boolean",
                "token": "string"
            }
        },
        {
            "method": "patch",
            "route": "/Auctions/bid",
            "parameterType": "application/json",
            "parameters": {
                "token": "string",
                "auctionId": "number",
                "accountId": "number",
                "price": "number"
            },
            "response": {
                "success": "boolean",
                "token": "string"
            }
        },
        {
            "method": "patch",
            "route": "/Auctions/buyNow",
            "parameterType": "application/json",
            "parameters": {
                "token": "string",
                "auctionId": "number"
            },
            "response": {
                "success": "boolean",
                "token": "string"
            }
        },
        {
            "method": "get",
            "route": "/guide",
            "response": {
                "success": "boolean",
                "html": "string"
            }
        }
    ]
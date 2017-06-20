var errors = {
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
                "message": "Wrong username or password"
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
                "code": 1040,
                "message": "Email not found"
            },
            {
                "code": 1050,
                "message": "Auction closed"
            },
            {
                "code": 1051,
                "message": "Someone bidded that price"
            }
        ]
    }
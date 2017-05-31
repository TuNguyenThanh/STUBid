# STUBid API Server
This is the API server for the STUBid project. It's a service that runs process HTTP request and use SocketIO for realtime countdown auctions.

# Server directory structure
```bash
├── server.js
├── config.js
├── package.json
├── controllers // contains routes handlers
|   ├── login.js
├── models // contains data managers
|   ├── auction.js
|   ├── product.js
|   └── user.js
└── helpers
    ├── db.js // database connector (config not published for security purposes)
    └── time.js // time formatter
```

Note:
- The server is built on Node.js v6.10.3
- cd to [repo location]/**SourceCode** - the server directory - before run the scripts
# Scripts
### Install dependencies
```bash
npm install
```

### Start the server
```bash
npm start
```

### API
|Method|Route|
|-|-|
|PATCH|/Auctions/bid|
- Parameters:
```javascript
{
	auctionId: number,
	accountId: number,
	price: number
}
```
- Response:
```javascript
{
    ok: boolean
}
```

|Method|Route|
|-|-|
|POST|/Accounts/login|
- Parameters:
```javascript
{
	username: string,
	password: string
}
```
- Response:
```javascript
{
  ok: boolean,
  token: string,
  profile: {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    avatar: string
  }
}
```

### Socket events
|Event type|Event name|
|-|-|
|ON|'SERVER-UPDATE-AUCTION'|

- Data:
```javascript
{
    auctionId: number,
    createdDate: string,
    activatedDate: string,
    duration: number,
    startPrice: number,
    ceilingPrice: number,
    bidIncreasement: number,
    seller: {
        accountId: number,
        firstName: string,
        lastName: string,
        phoneNumber: string
    },
    product: {
        productId: number,
        name: string,
        description: string,
        images: [
            {
                imageId: number,
                name: string,
                url: string
            }
        ],
        category: {
            categoryId: number,
            name: string,
            description: string,
            createdDate: string
        }
    },
    highestBidder: {
        accountId: number,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        price: number,
        timestamp: string
    },
    bids: number,
    timeLeft: string
}
```

|Event type|Event name|
|-|-|
|ON|'SERVER-SEND-INFO'|

- Data:
```javascript
{
    page: number,
    categoryId: number
}
```

|Event type|Event name|
|-|-|
|EMIT|'CLIENT-SEND-PAGE'|

- Data:
```javascript
page: number
```

|Event type|Event name|
|-|-|
|EMIT|'CLIENT-SEND-CATEGORY'|

- Data:
```javascript
categoryId: number
```

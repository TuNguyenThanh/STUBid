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

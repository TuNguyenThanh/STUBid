# STUBid
Ứng dụng đấu giá bán đồ cũ cho sinh viên

# Install dependencies
```bash
npm install
```

# Start the server
```bash
npm start
```

# Server directory structure
```bash
├── server.js
├── config.js
├── package.json
├── controllers // contains routes handlers
|   ├── 
├── models // contains data managers
|   ├── auction.js
|   ├── product.js
|   └── user.js
└── helpers
    ├── db.js // database connector (not published for security purposes)
    └── time.js // time formatter
```
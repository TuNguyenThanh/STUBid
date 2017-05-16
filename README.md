# STUBid
Ứng dụng đấu giá bán đồ cũ cho sinh viên

# Install dependencies
```bash
npm install
```

# Start the server
```bash
npm install
```

# Usage
## API
| Method | Route | Description | Params | 
| ------ | ----- | ----------- | ------ |
| ------ | ----- | ----------- | ------ |
| Response: |

## Socket.IO keys
#### SERVER-SEND-AUCTIONS
- Type: Broadcast
- Description: Server send auctions data to all socket every second
- Response:
```json
{
    "id": number,
    "createdDate": string,
    "activatedDate": string,
    "duration": number,
    "startPrice": number,
    "ceilingPrice": number,
    "currentPrice": number,
    "bidIncreasement": number,
    "product": {
        "name": string,
        "description": string,
        "category": {
            "id": number,
            "name": string,
            "description": string
        },
        "images": [
            {
                "id": number,
                "name": string,
                "url": string
            }
        ]
    },
    "timeLeft": string
}
```

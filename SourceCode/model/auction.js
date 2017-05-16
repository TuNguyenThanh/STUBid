var config = require('../config'),
    { timeLeftFormat } = require('../helpers/time');

var auctions = [];
var auctionsTimeLeft = [];
var fakedData = [{
    id: 1,
    createdDate: "2017-05-16 15:16:46+07",
    activatedDate: "2017-05-16 15:14:20+07",
    duration: 72, //hours
    startPrice: 2000, //x1000 VND
    ceilingPrice: 5000, //x1000 VND
    currentPrice: 2200, //x1000 VND
    bidIncreasement: 200, //x1000 VND
    product: {
        name: "Điện thoại Sony Xperia XA1",
        description: "Xperia XA1 là bản nâng cấp của chiếc Xperia XA đã khá thành công ở thị trường nước ta, với thiết kế khá tương đồng siêu phẩm Xperia XZ, cấu hình được trang bị cao hơn và camera có chất lượng tốt hơn.",
        category: {
            id: 1,
            name: "Công nghệ",
            description: "Các sản phẩm công nghệ"
        },
        images: [
            {
                id: 1,
                name: "sony-xperia-xa1.1.png"
            },
            {
                id: 2,
                name: "sony-xperia-xa1.2.png"
            }
        ]
    }
}]

exports.loadAuctions = () => {
    let now = Date.now();
    fakedData.forEach(e => {
        e.product.images.forEach(element => {
            element.url = `${config.DOMAIN_NAME}/image/product/${element.name}`
        });
        auctions.push(e)
        auctionsTimeLeft[e.id] = now - new Date(e.activatedDate).getTime();
    })
}

exports.getAuctions = () => {
    for (var i = 0; i < auctions.length; i++) {
        var element = auctions[i],
            timeLeft = auctionsTimeLeft[element.id];
        if (timeLeft > 0) {
            timeLeft--;
            element.timeLeft = timeLeftFormat(timeLeft);
        }
    }
    return auctions;
}
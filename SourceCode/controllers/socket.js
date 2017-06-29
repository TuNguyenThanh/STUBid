const { selectAuctions, getMyAuctions, getAtendedAuctions, selectAttendedAuctions, selectMyAuctions, selectSearchAuctions } = require('../models/auction')
const config = require('../config')

module.exports = function (socket) {
    var homeViewCategoryId = -1;
    var homeViewPage = 1;
    var homeViewInterval;

    var searchKey = '';
    var searchViewPage = 1;
    var searchViewCategoryId = -1;
    var searchViewInterval;

    var accountId;
    var attendedIds;
    var attendedViewPage = 1;
    var attendedViewInterval;
    var myAuctionsViewPage = 1;
    var myAuctionsViewInterval;

    if (socket.handshake.query.appName === 'sbid'
        || new RegExp(socket.handshake.headers.origin).test(config.ALLOW_ORIGIN) === true) {
        // console.log('connect');
        homeViewPage = 1;
        homeViewCategoryId = -1;
        setHomeView();
        console.log('CONNECTION ' + new Date().getSeconds());
    }
    else {
        socket.disconnect();
        console.log('disconnect due to handshake failed');
    }

    function setHomeView() {
        setTimeout(function () {
            homeViewInterval = setInterval(() => {
                let auctions = selectAuctions(homeViewPage- 1, homeViewCategoryId, accountId, attendedIds);
                socket.emit('SERVER-SEND-AUCTIONS', auctions);
            }, 1000);
        }, 1000 - Date.now() % 1000);
    }

    socket.on('CLIENT-SEND-PAGE', data => {
        console.log(data);
        homeViewPage= data.page;
    });

    socket.on('CLIENT-SEND-CATEGORY', data => {
        console.log(data);
        homeViewPage= 1;
        homeViewCategoryId = data.categoryId;
        let auctions = selectAuctions(homeViewPage- 1, homeViewCategoryId, accountId, attendedIds);
        socket.emit('SERVER-SEND-AUCTIONS', auctions);
    });

    // ATTENDED AUCTIONS
    function sendClosedAttendedAuctions() {
        attendedIds = [];
        let closedAttenedAuctions = [];
        getAtendedAuctions(accountId)
            .then(value => {
                value.forEach(function (auction) {
                    if (auction.state === 1)
                        attendedIds.push(auction.auctionId);
                    else closedAttenedAuctions.push(auction);
                });
                console.log(attendedIds);
                socket.emit('SERVER-SEND-CLOSED-ATTENDED-AUCTIONS', closedAttenedAuctions)
            })
            .catch(reason => console.log(reason))
    }

    socket.on('CLIENT-REQUEST-ATTENDED-AUCTIONS-VIEW', data => {
        console.log(data);
        attendedViewPage = 1;
        accountId = data.accountId;
        sendClosedAttendedAuctions();
        setTimeout(function () {
            attendedViewInterval = setInterval(() => {
                let { auctions, closedAuctions } = selectAttendedAuctions(attendedViewPage - 1, attendedIds);
                socket.emit('SERVER-SEND-ATTENDED-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0) {
                    sendClosedAttendedAuctions();
                }
            }, 1000);
        }, 1000 - Date.now() % 1000);
    })

    socket.on('CLIENT-SEND-ATTENDED-AUCTIONS-PAGE', data => {
        console.log(data);
        attendedViewPage = data.page;
    });

    // MY AUCTIONS
    socket.on('CLIENT-REQUEST-MY-AUCTIONS-VIEW', data => {
        console.log(data);
        myAuctionsViewPage = 1;
        accountId = data.accountId;
        sendMyClosedAuctions();
        setTimeout(function () {
            myAuctionsViewInterval = setInterval(() => {
                let { auctions, closedAuctions } = selectMyAuctions(myAuctionsViewPage - 1, accountId);
                socket.emit('SERVER-SEND-MY-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0)
                    sendMyClosedAuctions();
            }, 1000);
        }, 1000 - Date.now() % 1000);
    })

    function sendMyClosedAuctions() {
        getMyAuctions(accountId, [2])
            .then(value => socket.emit('SERVER-SEND-MY-CLOSED-AUCTIONS', value))
            .catch(reason => console.log(reason))
    }

    socket.on('CLIENT-SEND-MY-AUCTIONS-PAGE', data => {
        console.log(data);
        socmyAuctionsViewPage = data.page;
    });

    // SEARCH -- begin --
    socket.on('CLIENT-REQUEST-SEARCH-VIEW', () => {
        searchViewPage = 1;
        searchKey = '';
        setTimeout(function () {
            searchViewInterval = setInterval(() => {
                let auctions = selectSearchAuctions(searchViewPage - 1, searchViewCategoryId, searchKey);
                socket.emit('SERVER-SEND-SEARCH-AUCTIONS', auctions);
            }, 1000);
        }, 1000 - Date.now() % 1000);
    });

    socket.on('CLIENT-SEND-SEARCH-VIEW-PAGE', data => {
        console.log(data);
        searchViewPage = data.page;
    });

    socket.on('CLIENT-SEND-SEARCH-CATEGORY', data => {
        console.log(data);
        searchViewPage = 1;
        searchViewCategoryId = data.categoryId;
        let auctions = selectSearchAuctions(searchViewPage - 1, searchViewCategoryId, searchKey);
        socket.emit('SERVER-SEND-SEARCH-AUCTIONS', auctions);
    });

    socket.on('CLIENT-SEND-SEARCH-KEY', data => {
        console.log(data);
        searchKey = data.searchKey;
    })
    // SEARCH -- end --

    socket.on('disconnect', () => {
        console.log('disconnect');
    });
}
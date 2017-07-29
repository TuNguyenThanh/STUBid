const {
    selectAuctions,
    getMyAuctions,
    getAtendedAuctions,
    selectAttendedAuctions,
    selectMyAuctions,
    selectSearchAuctions,
    selectAuctionTimeleft,
} = require('../models/auction')
const config = require('../config');

var sockets = [];

connect = (socket) => {
    if (socket.handshake.query.appName === 'sbid' ||
        new RegExp(socket.handshake.headers.origin).test(config.ALLOW_ORIGIN) === true) {
        socket.homeViewPage = 1;
        socket.homeViewCategoryId = -1;
        sockets.push(socket);
        setHomeView();
    } else {
        socket.disconnect();
        console.log('disconnect due to handshake failed');
    }

    function setHomeView() {
        console.log(socket.homeViewPage);
        setTimeout(function () {
            socket.homeViewInterval = setInterval(() => {
                let auctions = selectAuctions(socket.homeViewPage - 1, socket.homeViewCategoryId, socket.accountId, socket.attendedIds);
                socket.emit('SERVER-SEND-AUCTIONS', auctions);
            }, 1000);
        }, 1000 - Date.now() % 1000);
    }

    socket.on('CLIENT-SEND-PAGE', data => {
        console.log(data);
        socket.homeViewPage = data.page;
    });

    socket.on('CLIENT-SEND-CATEGORY', data => {
        console.log(data);
        socket.homeViewPage = 1;
        socket.homeViewCategoryId = data.categoryId;
        let auctions = selectAuctions(socket.homeViewPage - 1, socket.homeViewCategoryId, socket.accountId, socket.attendedIds);
        socket.emit('SERVER-SEND-AUCTIONS', auctions);
    });

    // MY AUCTIONS -- begin --
    function sendClosedAttendedAuctions() {
        socket.attendedIds = [];
        let closedAttenedAuctions = [];
        getAtendedAuctions(socket.accountId)
            .then(value => {
                value.forEach((auction) => {
                    if (auction.state === 1)
                        socket.attendedIds.push(auction.auctionId);
                    else closedAttenedAuctions.push(auction);
                });
                socket.emit('SERVER-SEND-CLOSED-ATTENDED-AUCTIONS', closedAttenedAuctions)
            })
            .catch(reason => console.log(reason))
    }

    function sendMyClosedAuctions() {
        getMyAuctions(socket.accountId, [2])
            .then(value => socket.emit('SERVER-SEND-MY-CLOSED-AUCTIONS', value))
            .catch(reason => console.log(reason))
    }

    function sendMyUnactivatedAuctions() {
        getMyAuctions(socket.accountId, [0])
            .then(value => socket.emit('SERVER-SEND-UNACTIVATED-AUCTIONS', value))
            .catch(reason => console.log(reason))
    }

    function setMyAuctionsView() {
        if (socket.myAuctionsViewInterval) clearInterval(socket.myAuctionsViewInterval);
        if (socket.attendedViewInterval) clearInterval(socket.attendedViewInterval);
        sendClosedAttendedAuctions();
        sendMyClosedAuctions();
        sendMyUnactivatedAuctions();
        setTimeout(() => {
            socket.myAuctionsViewPage = 1;
            socket.attendedViewPage = 1;
            socket.myAuctionsViewInterval = setInterval(() => {
                let {
                    auctions,
                    closedAuctions
                } = selectMyAuctions(socket.myAuctionsViewPage - 1, socket.accountId);
                socket.emit('SERVER-SEND-MY-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0)
                    sendMyClosedAuctions();
            }, 1000);

            socket.attendedViewInterval = setInterval(() => {
                let {
                    auctions,
                    closedAuctions
                } = selectAttendedAuctions(socket.attendedViewPage - 1, socket.attendedIds);
                socket.emit('SERVER-SEND-ATTENDED-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0) {
                    sendClosedAttendedAuctions();
                }
            }, 1000);
        }, 1000 - Date.now() % 1000);
    }

    socket.on('CLIENT-REQUEST-ATTENDED-AUCTIONS-VIEW', data => {
        console.log(data);
        socket.accountId = data.accountId;
        setMyAuctionsView();
    })

    socket.on('CLIENT-SEND-ATTENDED-AUCTIONS-PAGE', data => {
        console.log(data);
        socket.attendedViewPage = data.page;
    });

    socket.on('CLIENT-REQUEST-MY-AUCTIONS-VIEW', data => {
        console.log(data);
        socket.accountId = data.accountId;
        setMyAuctionsView();
    })

    socket.on('CLIENT-SEND-MY-AUCTIONS-PAGE', data => {
        console.log(data);
        socket.myAuctionsViewPage = data.page;
    });
    // MY AUCTIONS -- end --

    // SEARCH -- begin --
    socket.on('CLIENT-REQUEST-SEARCH-VIEW', () => {
        socket.searchViewPage = 1;
        socket.searchKey = '';
        setTimeout(function () {
            socket.searchViewInterval = setInterval(() => {
                let auctions = selectSearchAuctions(socket.searchViewPage - 1, socket.searchViewCategoryId, socket.searchKey);
                socket.emit('SERVER-SEND-SEARCH-AUCTIONS', auctions);
            }, 1000);
        }, 1000 - Date.now() % 1000);
    });

    socket.on('CLIENT-SEND-SEARCH-VIEW-PAGE', data => {
        console.log(data);
        socket.searchViewPage = data.page;
    });

    socket.on('CLIENT-SEND-SEARCH-CATEGORY', data => {
        console.log(data);
        socket.searchViewPage = 1;
        socket.searchViewCategoryId = data.categoryId;
        let auctions = selectSearchAuctions(socket.searchViewPage - 1, socket.searchViewCategoryId, socket.searchKey);
        socket.emit('SERVER-SEND-SEARCH-AUCTIONS', auctions);
    });

    socket.on('CLIENT-SEND-SEARCH-KEY', data => {
        console.log(data);
        socket.searchKey = data.searchKey;
    })
    // SEARCH -- end --

    // AUCTION DETAILS --
    socket.on('CLIENT-REQUEST-AUCTION-TIMELEFT', (data) => {
        if (socket.auctionTimeleftInterval) clearInterval(socket.auctionTimeleftInterval);
        if (data.auctionId) {
            setTimeout(function () {
                socket.auctionTimeleftInterval = setInterval(() => {
                    let auctions = selectAuctionTimeleft(data.auctionId);
                    socket.emit('SERVER-SEND-AUCTION-TIMELEFT', auctions);
                }, 1000);
            }, 1000 - Date.now() % 1000);
        }
    });
    // AUCTION DETAILS -- END

    socket.on('disconnect', () => {
        console.log('disconnect');
        clearInterval(socket.homeViewInterval);
        clearInterval(socket.searchViewInterval);
        clearInterval(socket.myAuctionsViewInterval);
        clearInterval(socket.attendedViewInterval);
        clearInterval(socket.auctionTimeleftInterval);
    });
}

sendUnactivated = (accountId) => {
    console.log('188', accountId);
    sockets.forEach((e) => {
        console.log('190', e.accountId);
        if (e.accountId === accountId) {
            getMyAuctions(e.accountId, [0])
                .then(value => {
                    console.log(value);
                    e.emit('SERVER-SEND-UNACTIVATED-AUCTIONS', value);
                })
                .catch(reason => console.log(reason))
        }
    });
}

module.exports = {
    connect,
    sendUnactivated,
};
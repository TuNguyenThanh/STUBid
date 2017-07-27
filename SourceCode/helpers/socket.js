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
        this.homeViewPage = 1;
        this.homeViewCategoryId = -1;
        sockets.push(socket);
        setHomeView();
    } else {
        socket.disconnect();
        console.log('disconnect due to handshake failed');
    }

    function setHomeView() {
        setTimeout(function () {
            this.homeViewInterval = setInterval(() => {
                let auctions = selectAuctions(this.homeViewPage - 1, this.homeViewCategoryId, this.accountId, this.attendedIds);
                socket.emit('SERVER-SEND-AUCTIONS', auctions);
            }, 1000);
        }, 1000 - Date.now() % 1000);
    }

    socket.on('CLIENT-SEND-PAGE', data => {
        console.log(data);
        this.homeViewPage = data.page;
    });

    socket.on('CLIENT-SEND-CATEGORY', data => {
        console.log(data);
        this.homeViewPage = 1;
        this.homeViewCategoryId = data.categoryId;
        let auctions = selectAuctions(this.homeViewPage - 1, this.homeViewCategoryId, this.accountId, this.attendedIds);
        socket.emit('SERVER-SEND-AUCTIONS', auctions);
    });

    // MY AUCTIONS -- begin --
    function sendClosedAttendedAuctions() {
        this.attendedIds = [];
        let closedAttenedAuctions = [];
        getAtendedAuctions(this.accountId)
            .then(value => {
                value.forEach((auction) => {
                    if (auction.state === 1)
                        this.attendedIds.push(auction.auctionId);
                    else closedAttenedAuctions.push(auction);
                });
                socket.emit('SERVER-SEND-CLOSED-ATTENDED-AUCTIONS', closedAttenedAuctions)
            })
            .catch(reason => console.log(reason))
    }

    function sendMyClosedAuctions() {
        getMyAuctions(this.accountId, [2])
            .then(value => socket.emit('SERVER-SEND-MY-CLOSED-AUCTIONS', value))
            .catch(reason => console.log(reason))
    }

    function sendMyUnactivatedAuctions() {
        getMyAuctions(this.accountId, [0])
            .then(value => socket.emit('SERVER-SEND-UNACTIVATED-AUCTIONS', value))
            .catch(reason => console.log(reason))
    }

    function setMyAuctionsView() {
        if (this.myAuctionsViewInterval) clearInterval(this.myAuctionsViewInterval);
        if (this.attendedViewInterval) clearInterval(this.attendedViewInterval);
        sendClosedAttendedAuctions();
        sendMyClosedAuctions();
        sendMyUnactivatedAuctions();
        setTimeout(() => {
            this.myAuctionsViewInterval = setInterval(() => {
                let {
                    auctions,
                    closedAuctions
                } = selectMyAuctions(this.myAuctionsViewPage - 1, this.accountId);
                socket.emit('SERVER-SEND-MY-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0)
                    sendMyClosedAuctions();
            }, 1000);

            this.attendedViewInterval = setInterval(() => {
                let {
                    auctions,
                    closedAuctions
                } = selectAttendedAuctions(this.attendedViewPage - 1, this.attendedIds);
                socket.emit('SERVER-SEND-ATTENDED-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0) {
                    sendClosedAttendedAuctions();
                }
            }, 1000);
        }, 1000 - Date.now() % 1000);
    }

    socket.on('CLIENT-REQUEST-ATTENDED-AUCTIONS-VIEW', data => {
        console.log(data);
        this.attendedViewPage = 1;
        this.accountId = data.accountId;
        setMyAuctionsView();
    })

    socket.on('CLIENT-SEND-ATTENDED-AUCTIONS-PAGE', data => {
        console.log(data);
        this.attendedViewPage = data.page;
    });

    socket.on('CLIENT-REQUEST-MY-AUCTIONS-VIEW', data => {
        console.log(data);
        this.myAuctionsViewPage = 1;
        this.accountId = data.accountId;
        socket.accountId = data.accountId;
        setMyAuctionsView();
    })

    socket.on('CLIENT-SEND-MY-AUCTIONS-PAGE', data => {
        console.log(data);
        this.myAuctionsViewPage = data.page;
    });
    // MY AUCTIONS -- end --

    // SEARCH -- begin --
    socket.on('CLIENT-REQUEST-SEARCH-VIEW', () => {
        this.searchViewPage = 1;
        this.searchKey = '';
        setTimeout(function () {
            this.searchViewInterval = setInterval(() => {
                let auctions = selectSearchAuctions(this.searchViewPage - 1, this.searchViewCategoryId, this.searchKey);
                socket.emit('SERVER-SEND-SEARCH-AUCTIONS', auctions);
            }, 1000);
        }, 1000 - Date.now() % 1000);
    });

    socket.on('CLIENT-SEND-SEARCH-VIEW-PAGE', data => {
        console.log(data);
        this.searchViewPage = data.page;
    });

    socket.on('CLIENT-SEND-SEARCH-CATEGORY', data => {
        console.log(data);
        this.searchViewPage = 1;
        this.searchViewCategoryId = data.categoryId;
        let auctions = selectSearchAuctions(this.searchViewPage - 1, this.searchViewCategoryId, this.searchKey);
        socket.emit('SERVER-SEND-SEARCH-AUCTIONS', auctions);
    });

    socket.on('CLIENT-SEND-SEARCH-KEY', data => {
        console.log(data);
        this.searchKey = data.searchKey;
    })
    // SEARCH -- end --

    // AUCTION DETAILS --
    socket.on('CLIENT-REQUEST-AUCTION-TIMELEFT', (data) => {
        if (this.auctionTimeleftInterval) clearInterval(this.auctionTimeleftInterval);
        if (data.auctionId) {
            setTimeout(function () {
                this.auctionTimeleftInterval = setInterval(() => {
                    let auctions = selectAuctionTimeleft(data.auctionId);
                    socket.emit('SERVER-SEND-AUCTION-TIMELEFT', auctions);
                }, 1000);
            }, 1000 - Date.now() % 1000);
        }
    });
    // AUCTION DETAILS -- END

    socket.on('disconnect', () => {
        console.log('disconnect');
        clearInterval(this.homeViewInterval);
        clearInterval(this.searchViewInterval);
        clearInterval(this.myAuctionsViewInterval);
        clearInterval(this.attendedViewInterval);
        clearInterval(this.auctionTimeleftInterval);
    });
}

sendUnactivated = (accountId) => {
    sockets.forEach((e) => {
        if (e.accountId === parseInt(accountId)) {
            getMyAuctions(this.accountId, [0])
                .then(value => socket.emit('SERVER-SEND-UNACTIVATED-AUCTIONS', value))
                .catch(reason => console.log(reason))
        }
    });
}

module.exports = {
    connect,
    sendUnactivated,
};
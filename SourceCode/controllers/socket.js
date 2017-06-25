const { selectAuctions, getMyAuctions, getAtendedAuctions, selectMyAuctions } = require('../models/auction')
const config = require('../config')

module.exports = function (socket) {
    if (socket.handshake.query.appName === 'sbid'
        || new RegExp(socket.handshake.headers.origin).test(config.ALLOW_ORIGIN) === true)
    {
        // console.log('connect');
        socket.page = 1;
        socket.categoryId = -1;
        setSocketInterval();
    }
    else {
        socket.disconnect();
        console.log('disconnect due to handshake failed');
    }

    function setSocketInterval() {
        setTimeout(function() {
            socket.interval = setInterval(() => {
                let { auctions, closedAuctions } = selectAuctions(socket.page - 1, socket.categoryId, socket.accountId, socket.attendedIds);
                socket.emit('SERVER-SEND-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0) {
                    if (socket.attendedIds && socket.attendedIds.length > 0)
                        sendMyClosedAuctions();
                }
            }, 1000);
        }, 1000 - Date.now()%1000);
    }

    function sendClosedAttendedAuctions() {
        socket.attendedIds = [];
        let closedAttenedAuctions = [];
        getAtendedAuctions(socket.accountId)
        .then(value => {
            value.forEach(function(auction) {
                if (auction.state === 1)
                    socket.attendedIds.push(auction.auctionId);
                else closedAttenedAuctions.push(auction);
            });
            console.log(socket.attendedIds);
            socket.emit('SERVER-SEND-CLOSED-ATTENDED-AUCTIONS', closedAttenedAuctions)
        })
        .catch(reason => console.log(reason))
    }

    socket.emit('SERVER-SEND-INFO', { page: socket.page, categoryId: socket.categoryId })

    socket.on('CLIENT-REQUEST-HOME-VIEW', data => {
        socket.page = 1;
        socket.categoryId = -1;
        delete socket.accountId;
        delete socket.attendedIds;
        clearInterval(socket.intervalMyAuctionsView);
        delete socket.intervalMyAuctionsView;
    })

    socket.on('CLIENT-REQUEST-ATTENDED-AUCTIONS-VIEW', data => {
        console.log(data);
        socket.page = 1;
        socket.categoryId = -1;
        socket.accountId = data.accountId;
        sendClosedAttendedAuctions();
    })

    socket.on('CLIENT-REQUEST-MY-AUCTIONS-VIEW', data => {
        console.log(data);
        socket.pageMyAuctionsView = 1;
        socket.categoryId = -1;
        socket.accountId = data.accountId;
        sendMyClosedAuctions();
        setTimeout(function() {
            socket.intervalMyAuctionsView = setInterval(() => {
                let { auctions, closedAuctions } = selectMyAuctions(socket.pageMyAuctionsView - 1, socket.accountId);
                socket.emit('SERVER-SEND-MY-AUCTIONS', auctions);
                if (closedAuctions && closedAuctions.length > 0) 
                    sendMyClosedAuctions();
            }, 1000);
        }, 1000 - Date.now()%1000);
    })

    function sendMyClosedAuctions() {
        getMyAuctions(socket.accountId, [2])
        .then(value => {
            socket.emit('SERVER-SEND-MY-CLOSED-AUCTIONS', value)
        })
        .catch(reason => console.log(reason))
    }

    socket.on('CLIENT-SEND-MY-AUCTIONS-PAGE', data => {
        console.log(data);
        socket.pageMyAuctionsView = data.page;
    });

    socket.on('CLIENT-SEND-PAGE', data => {
        console.log(data);
        socket.page = data.page;
    });

    socket.on('CLIENT-SEND-CATEGORY', data => {
        console.log(data);
        socket.page = 1;
        socket.categoryId = data.categoryId;
    });

    socket.on('disconnect', () => {
        clearInterval(socket.interval);
        clearInterval(socket.intervalMyAuctionsView);
        delete socket.intervalMyAuctionsView;
        console.log('disconnect');
    });
}
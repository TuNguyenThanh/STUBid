const AUCTION = require('../models/auction')
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
    setTimeout(() => {
      socket.homeViewInterval = setInterval(() => {
        AUCTION.selectAuctions(socket.homeViewPage - 1, socket.homeViewCategoryId, socket.accountId, socket.attendedIds)
          .then((auctions) => socket.emit('SERVER-SEND-AUCTIONS', auctions))
          .catch(console.log);
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
    AUCTION.selectAuctions(socket.homeViewPage - 1, socket.homeViewCategoryId, socket.accountId, socket.attendedIds)
      .then((auctions) => socket.emit('SERVER-SEND-AUCTIONS', auctions))
      .catch(console.log);
  });

  // MY AUCTIONS -- begin --
  function getAttendedAuctions() {
    socket.attendedIds = [];
    let closedAuctions = [];
    AUCTION.getAtendedAuctionIds(socket.accountId)
      .then((results) => {
        results.forEach((auction) => {
          if (auction.state === 1)
            socket.attendedIds.push(auction.auctionId);
          else closedAuctions.push(auction.auctionId);
        });
        AUCTION.getAll(closedAuctions)
          .then((results) => socket.emit('SERVER-SEND-MY-CLOSED-AUCTIONS', results))
          .catch(console.log);
      })
      .catch(console.log)
  }

  function getMyAuctions() {
    socket.myAuctionIds = [];
    let pendingAuctions = [];
    let closedAuctions = [];
    AUCTION.getMyAuctionIds(socket.accountId)
      .then((results) => {
        results.forEach((auction) => {
          switch (auction.state) {
            case 0:
              pendingAuctions.push(auction.auctionId);
              break;

            case 1:
              socket.myAuctionIds.push(auction.auctionId);
              break;

            default:
              closedAuctions.push(auction.auctionId);
              break;
          }
        });
        AUCTION.getAll(closedAuctions)
          .then((results) => socket.emit('SERVER-SEND-MY-CLOSED-AUCTIONS', results))
          .catch(console.log);
        AUCTION.getAll(pendingAuctions)
          .then((results) => socket.emit('SERVER-SEND-MY-CLOSED-AUCTIONS', results))
          .catch(console.log);
      })
      .catch(console.log);
  }

  function setMyAuctionsView() {
    if (socket.myAuctionsViewInterval) clearInterval(socket.myAuctionsViewInterval);
    if (socket.attendedViewInterval) clearInterval(socket.attendedViewInterval);
    getAttendedAuctions();
    getMyAuctions();
    setTimeout(() => {
      socket.myAuctionsViewPage = 1;
      socket.attendedViewPage = 1;
      socket.myAuctionsViewInterval = setInterval(() => {
        AUCTION.selectMyAuctions(socket.myAuctionsViewPage - 1, socket.myAuctionIds)
          .then(({
            auctions,
            isExistClosed
          }) => {
            socket.emit('SERVER-SEND-MY-AUCTIONS', auctions);
            if (isExistClosed) sendMyClosedAuctions();
          })
          .catch(console.log);
      }, 1000);

      socket.attendedViewInterval = setInterval(() => {
        AUCTION.selectMyAuctions(socket.attendedViewPage - 1, socket.attendedIds)
          .then(({
            auctions,
            isExistClosed
          }) => {
            socket.emit('SERVER-SEND-ATTENDED-AUCTIONS', auctions);
            if (isExistClosed) sendClosedAttendedAuctions();
          })
          .catch(console.log);
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
    setTimeout(() => {
      socket.searchViewInterval = setInterval(() => {
        AUCTION.selectSearchAuctions(socket.searchViewPage - 1, socket.searchViewCategoryId, socket.searchKey)
          .then((results) => socket.emit('SERVER-SEND-SEARCH-AUCTIONS', results))
          .catch(console.log);
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
    AUCTION.selectSearchAuctions(socket.searchViewPage - 1, socket.searchViewCategoryId, socket.searchKey)
      .then(({
        auctions,
        isExistClosed
      }) => {
        socket.emit('SERVER-SEND-SEARCH-AUCTIONS', auctions);
        if (isExistClosed) sendClosedAttendedAuctions();
      })
      .catch(console.log);
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
      setTimeout(() => {
        socket.auctionTimeleftInterval = setInterval(() => {
          let timeleft = AUCTION.selectAuctionTimeleft(data.auctionId);
          if (timeleft)
            socket.emit('SERVER-SEND-AUCTION-TIMELEFT', timeleft);
          else {
            clearInterval(socket.auctionTimeleftInterval);
            delete socket.auctionTimeleftInterval
          }
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
  sockets.filter((e) => e.accountId === accountId)
    .forEach((e) => socket.getMyAuction());
}

module.exports = {
  connect,
  sendUnactivated,
};
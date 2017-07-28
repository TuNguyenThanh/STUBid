import ApiConfig from '../Config/ApiConfig'
import IO from 'socket.io-client/dist/socket.io'

const socket = IO(ApiConfig.baseSocketIOURL);
let reConnectHandler = { };
let homeAuctionHandler, attendedAuctionHandler, attendedCloseAuctionHandler, myAuctionsAuctionHandler, searchAuctionsHandler, myUnActiveAuctionsHandler;

socket.on('reconnect', (data) => {
  if (reConnectHandler.homeView) reConnectHandler.homeView();
  if (reConnectHandler.searchView) reConnectHandler.searchView();
  if (reConnectHandler.myAuctionView) reConnectHandler.myAuctionView();
});

socket.on('SERVER-SEND-AUCTIONS', (data) => {
  if (homeAuctionHandler) homeAuctionHandler(data);
});

socket.on('SERVER-SEND-ATTENDED-AUCTIONS', (data) => {
  if (attendedAuctionHandler) attendedAuctionHandler(data);
});

socket.on('SERVER-SEND-CLOSED-ATTENDED-AUCTIONS', (data) => {
  if (attendedCloseAuctionHandler) attendedCloseAuctionHandler(data);
});

socket.on('SERVER-SEND-MY-AUCTIONS', (data) => {
  if (myAuctionsAuctionHandler) myAuctionsAuctionHandler(data);
});

socket.on('SERVER-SEND-SEARCH-AUCTIONS', (data) => {
  if (searchAuctionsHandler) searchAuctionsHandler(data);
});

socket.on('SERVER-SEND-UNACTIVATED-AUCTIONS', (data) => {
  if (myUnActiveAuctionsHandler) myUnActiveAuctionsHandler(data);
});

const homeHandler = new class {
  setServerSendAuctionsHandler = (handler, page, categoryId) => {
    homeAuctionHandler = handler;
    if (page) this.emitHomePage(page);
    if (categoryId) this.emitHomeCategory(categoryId);
  };
  emitCategoryAndPage = (categoryId, page) => {
    if (page) this.emitHomePage(page);
    if (categoryId) this.emitHomeCategory(categoryId);
    reConnectHandler.homeView = () => {
      this.emitHomePage(page);
      this.emitHomeCategory(categoryId);
    }
  };
  emitHomePage = (page) => { socket.emit('CLIENT-SEND-PAGE', { page: page }) };
  emitHomeCategory = (categoryId) => { socket.emit('CLIENT-SEND-CATEGORY', { categoryId: categoryId }); }
}

const attendedHandler = new class {
  setServerSendAttendedAuctionsHandler = (handler, accountId, page) => {
    attendedAuctionHandler = handler;
  //  if (accountId) this.emitAttendedView(accountId);
  //  if (page) this.emitAttendedPage(page);
  };
  emitAttendedView = (accountId) => { socket.emit('CLIENT-REQUEST-ATTENDED-AUCTIONS-VIEW', { accountId: accountId }) };
  emitAttendedPage = (page) => { socket.emit('CLIENT-SEND-ATTENDED-AUCTIONS-PAGE', { page: page }) };
}

const attendedCloseHandler = new class {
  setServerSendCloseAttendedAuctionsHandler = (handler) => {
    attendedCloseAuctionHandler = handler;
  };
}

const myAuctionsHandler = new class {
  accountId;
  page;
  setServerSendMyAuctionsHandler = (handler, accountId, page) => {
    myAuctionsAuctionHandler = handler;
    // socket.on('reconnect', (data) => {
    //   this.emitMyAuctionsView(accountId);
    //   this.emitMyAuctionsPage(page);
    // });
    reConnectHandler.myAuctionView = () => {
      this.emitMyAuctionsView(this.accountId);
      this.emitMyAuctionsPage(this.page);
    }
    if (accountId) this.emitMyAuctionsView(accountId);
    if (page) this.emitMyAuctionsPage(page);
  };
  emitMyAuctionsView = (accountId) => {
    socket.emit('CLIENT-REQUEST-MY-AUCTIONS-VIEW', { accountId: accountId });
    this.accountId = accountId;
  };
  emitMyAuctionsPage = (page) => {
    socket.emit('CLIENT-SEND-MY-AUCTIONS-PAGE', { page: page });
    this.page = page;
  };
}

const searchAuctions = new class {
  categoryId;
  keySearch;
  setServerSendSearchHandler = (handler, categoryId, keySearch) => {
    searchAuctionsHandler = handler;
    this.emitSearchView();
    if(categoryId) this.emitCategory(categoryId);
    if(keySearch) this.emitKeySearch(keySearch);

    reConnectHandler.searchView = () => {
      this.emitSearchView();
      if(this.categoryId) this.emitCategory(this.categoryId);
      if(this.keySearch) this.emitKeySearch(this.keySearch);
    }
  };
  emitSearchView = () => { socket.emit('CLIENT-REQUEST-SEARCH-VIEW') };
  emitCategory = (categoryId) => {
    socket.emit('CLIENT-SEND-SEARCH-CATEGORY', { categoryId: categoryId });
    this.categoryId = categoryId;
  };
  emitKeySearch = (keySearch) => {
    socket.emit('CLIENT-SEND-SEARCH-KEY', { searchKey: keySearch });
    this.keySearch = keySearch;
  };
}

const myUnActiveHandler = new class {
  setMyUnActiveAuctionsHandler = (handler) => {
    myUnActiveAuctionsHandler = handler;
  };
}

module.exports = { homeHandler, attendedHandler, attendedCloseHandler, myAuctionsHandler, searchAuctions, myUnActiveHandler }

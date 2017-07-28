import { Injectable } from '@angular/core';
import { BaseService } from "./base.service";
import { Constants } from "./constant";

declare var io: any

@Injectable()
export class AuctionService {
  getRealtimeAuctions: any;
  socket: any;
  page: number;
  categoryId: number;

  constructor(
    public baseService: BaseService
  ) {
    this.socket = io(Constants.domain, { query: "appName=sbid" });
    this.socket.on('disconnect', () => console.log('disconnect'))
    this.socket.on('SERVER-SEND-INFO', result => {
      this.page = result.page;
      this.categoryId = result.categoryId;
    });
  }

  setAuctionsListener(cb) {
    // this.socket.on('SERVER-SEND-AUCTIONS', cb);
  }

  requestAuctionTimeleft(auctionId, cb) {
    console.log(auctionId);
    this.socket.emit('CLIENT-REQUEST-AUCTION-TIMELEFT', { auctionId });
    this.socket.on('SERVER-SEND-AUCTION-TIMELEFT', cb);
    this.socket.on('reconnect', () => {
      this.socket.emit('CLIENT-REQUEST-AUCTION-TIMELEFT', { auctionId });
    })
  }

  getAuctions(page: number, categoryId?: number) {
    var url;
    if (categoryId) {
      url = `${Constants.baseUrl}/Auctions/category/${categoryId}/page/${page}`;
    }
    else {
      url = `${Constants.baseUrl}/Auctions/page/${page}`;
    }
    return this.baseService.getSth(url);
  }

  getAuction(auctionId: string) {
    let url = `${Constants.baseUrl}/Auctions/${auctionId}`;
    return this.baseService.getSth(url);
  }

  active(auctionId: string, token: string) {
    let url = `${Constants.baseUrl}/Auctions/active/${auctionId}`;
    let body = {
      token
    }
    console.log(body);
    return this.baseService.patchSth(url, body, Constants.commonHeader);
  }

  update(auctionId: string, auction: any, token: string) {
    let url = `${Constants.baseUrl}/Auctions/${auctionId}`;
    let body = { token, auction };
    return this.baseService.patchSth(url, body, Constants.commonHeader);
  }

  closeOrDelete(auctionId: string, token: string) {
    let url = `${Constants.baseUrl}/Auctions/closeOrDelete`;
    let body = {
      auctionId,
      token
    }
    return this.baseService.postSth(url, body, Constants.commonHeader);
  }
}

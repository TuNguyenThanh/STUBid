import { Injectable } from '@angular/core';
import { BaseService } from "./base.service";
import { Constants } from "./constant";

// declare var io: any

@Injectable()
export class AuctionService {
  getRealtimeAuctions: any;
  socket: any;
  page: number;
  categoryId: number;

  constructor(
    public baseService: BaseService
  ) {
    // this.socket = io(Constants.baseUrl);
    // this.socket.on('disconnect', () => console.log('disconnect'))
    // this.socket.on('SERVER-SEND-INFO', result => {
    //   this.page = result.page;
    //   this.categoryId = result.categoryId;
    // });
  }

  setAuctionsListener(cb) {
    // this.socket.on('SERVER-SEND-AUCTIONS', cb);
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
}

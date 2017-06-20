import { Component, OnInit } from '@angular/core';
import { AuctionService } from "../service/auction.service";

// declare var io: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuctionService]
})
export class HomeComponent implements OnInit {
  socket: any;
  auctions: any;

  constructor(
    public auctionService: AuctionService
  ) { }

  ngOnInit() {
    // this.auctionService.setAuctionsListener(result => {
    //   this.auctions = result;
    //   console.log(result);
    // })
  }

}

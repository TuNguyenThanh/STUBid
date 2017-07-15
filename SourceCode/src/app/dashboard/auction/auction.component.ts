import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuctionService } from '../../service/auction.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
  providers: [AuctionService]
})
export class AuctionComponent implements OnInit {
  auction: any;

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
  ) { }

  ngOnInit() {
    this.getAuctionId()
      .then((auctionId: string) => {
        return this.getAuction(auctionId);
      })
      .then(() => { })
      .catch(() => { })
  }

  getAuctionId() {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(
        (value: any) => {
          console.log(value);
          resolve(value.auctionId);
        },
        (error: any) => {
          console.log(error);
          reject();
        }
      )
    });
  }

  getAuction(auctionId: string) {
    return new Promise((resolve, reject) => {
      this.auctionService.getAuction(auctionId).subscribe(
        (value: any) => {
          console.log(value);
          if (value.success) {
            this.auction = value.result;
          }
          resolve();
        },
        (error: any) => {
          console.log(error);
          reject();
        }
      )
    });
  }

}

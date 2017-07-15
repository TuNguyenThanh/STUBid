import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoadingBar } from '../../shared/loading-bar/loading-bar';
import { AuctionService } from '../../service/auction.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
  providers: [AuctionService]
})
export class AuctionComponent implements OnInit {
  auction: any;
  imageLoaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
    private loadingBar: LoadingBar,
  ) { }

  ngOnInit() {
    this.loadingBar.show();
    this.getAuctionId()
      .then((auctionId: string) => {
        return this.getAuction(auctionId);
      })
      .then(() => { })
      .catch(() => { this.loadingBar.hide() })
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

  activeAuction() {
    this.loadingBar.show();
    setTimeout(() => {
      this.loadingBar.hide();
    }, 2000);
  }

  imageComplete() {
    this.loadingBar.hide();
    this.imageLoaded = true;
  }
}

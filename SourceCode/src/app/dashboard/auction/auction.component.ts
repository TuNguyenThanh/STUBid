import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingBar } from '../../shared/loading-bar/loading-bar';
import { AuctionService } from '../../service/auction.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
  providers: [AuctionService]
})
export class AuctionComponent implements OnInit {
  auction: any;
  imageLoaded: boolean;
  loading: boolean;
  timeleft: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private auctionService: AuctionService,
    private loadingBar: LoadingBar,
    private router: Router,
  ) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: window.location.pathname } });
    } else {
      this.loadingBar.show();
      this.getAuctionId()
        .then((auctionId: string) => {
          return this.getAuction(auctionId);
        })
        .then(() => {
          if (this.auction.state === 1) {
            this.auctionService.requestAuctionTimeleft(this.auction.auctionId, this.timeleftHandler);
          }
        })
        .catch(() => { this.loadingBar.hide() })
    }
  }

  ngOnInit() { }

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
    this.loading = true;
    let token = this.authService.getLocalToken();
    this.auctionService.active(this.auction.auctionId, token).subscribe(
      (value: any) => {
        console.log(value);
        if (value.success) {
          if (value.token) {
            this.authService.updateLocalToken(value.token)
          }
          this.auction.state = 1;
          this.auctionService.requestAuctionTimeleft(this.auction.auctionId, this.timeleftHandler);
        }
        this.loadingBar.hide();
        this.loading = false;
      },
      (error: any) => {
        console.log(error);
        this.loadingBar.hide();
        this.loading = false;
      }
    );
  }

  closeOrDeleteAuction() {
    this.loadingBar.show();
    this.loading = true;
    let token = this.authService.getLocalToken();
    this.auctionService.closeOrDelete(this.auction.auctionId, token).subscribe(
      (value: any) => {
        console.log(value);
        if (value.success) {
          if (value.token) {
            this.authService.updateLocalToken(value.token)
          }
          if (this.auction.state === 0) {
            this.router.navigate(['/dashboard']);
          }
          else {
            this.auction.state = 3;
          }
        }
        this.loadingBar.hide();
        this.loading = false;
      },
      (error: any) => {
        console.log(error);
        this.loadingBar.hide();
        this.loading = false;
      }
    );
  }

  timeleftHandler = (data: any) => {
    let duration = data;
    let hours = Math.floor(duration / 3600); duration -= (3600 * hours);
    let minutes = Math.floor(duration / 60);
    let seconds = duration - 60 * minutes;

    var output = [hours, minutes, seconds].map(number => number < 10 ? `0${number}` : number).join(":");
    this.timeleft = output;
  }

  imageComplete() {
    this.loadingBar.hide();
    this.imageLoaded = true;
  }
}

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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private auctionService: AuctionService,
    private loadingBar: LoadingBar,
    private router: Router,
  ) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: window.location.pathname }});
    } else {
      this.loadingBar.show();
      this.getAuctionId()
        .then((auctionId: string) => {
          return this.getAuction(auctionId);
        })
        .then(() => { })
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
    let token = this.authService.getLocalToken();
    this.auctionService.active(this.auction.auctionId, token)
      .subscribe(
      (value: any) => {
        console.log(value);
        this.loadingBar.hide();
      },
      (error: any) => {
        console.log(error);
        this.loadingBar.hide();
      }
      )
  }

  imageComplete() {
    this.loadingBar.hide();
    this.imageLoaded = true;
  }
}

import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingBar } from '../../shared/loading-bar/loading-bar';
import { AuthService } from '../../service/auth.service';
import { AuctionService } from '../../service/auction.service';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { UserLevelService } from '../../service/userLevel.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
  providers: [
    AuctionService,
    ProductService,
    CategoryService,
    UserLevelService
  ]
})
export class AuctionComponent implements OnInit {
  auction: any;
  imageLoaded: boolean;
  loading: boolean;
  timeleft: string;
  categorys: Array<any>;
  userLevels: Array<any>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private auctionService: AuctionService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private userLevelService: UserLevelService,
    private loadingBar: LoadingBar,
    private router: Router,
  ) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: window.location.pathname } });
    } else {
      this.loadingBar.show();
      this.getCategorys()
        .then(() => {
          return this.getUserLevels();
        })
        .then(() => {
          return this.getAuctionId();
        })
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

  getUserLevels() {
    return new Promise((resolve, reject) => {
      this.userLevelService.getAll().subscribe(
        (value: any) => {
          console.log(value);
          this.userLevels = value.results;
          resolve();
        },
        (error: any) => {
          console.log(error);
          reject();
        }
      )
    });
  }

  getCategorys() {
    return new Promise((resolve, reject) => {
      this.categoryService.getAll().subscribe(
        (value: any) => {
          console.log(value);
          this.categorys = value.result;
          resolve();
        },
        (error: any) => {
          console.log(error);
          reject();
        }
      )
    });
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

  updateProduct(key: string, value: any) {
    let product = {};
    product[key] = value;
    this.loadingBar.show();
    this.loading = true;
    if (key === 'categoryId') this.auction.product.category = this.categorys.find(e => e.categoryId === value);
    this.productService.update(this.auction.product.productId, product, this.authService.getLocalToken()).subscribe(
      (value) => {
        if (value.token) {
          this.authService.updateLocalToken(value.token);
        }
        if (value.error) {
          console.log(value.error);
        }
        this.loadingBar.hide();
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loadingBar.hide();
        this.loading = false;
      }
    );
  }

  updateAuction(key: string, value: any) {
    let auction = {};
    auction[key] = value;
    this.loadingBar.show();
    this.loading = true;
    if (key === 'allowedUserLevel') this.auction.allowedUserLevel = this.userLevels.find(e => e.userLevelId === value);
    this.auctionService.update(this.auction.auctionId, auction, this.authService.getLocalToken()).subscribe(
      (value) => {
        if (value.token) {
          this.authService.updateLocalToken(value.token);
        }
        if (value.error) {
          console.log(value.error);
        }
        this.loadingBar.hide();
        this.loading = false;
      },
      (error) => {
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

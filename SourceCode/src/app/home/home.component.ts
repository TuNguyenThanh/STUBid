import { Component, OnInit } from '@angular/core';
import { AuctionService } from "../service/auction.service";

import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
export class HomeComponent implements OnInit {
  socket: any;
  auctions: any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}

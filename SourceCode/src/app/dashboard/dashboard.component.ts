import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth.service';

declare const componentHandler: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    AuthService
  ]
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  currentUser: any;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    else {
      this.currentUser = this.authService.getCurrentUser();
      console.log(this.currentUser);
    }
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    componentHandler.upgradeAllRegistered();
  }

}

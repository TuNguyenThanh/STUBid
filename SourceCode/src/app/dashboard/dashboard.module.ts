import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './dashboard.routes';

import { DashboardComponent } from './dashboard.component';
import { AuctionComponent } from './auction/auction.component';

import { AuthService } from '../service/auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DashboardComponent,
    AuctionComponent,
  ],
  providers: [
    AuthService
  ]
})
export class DashboardModule { }

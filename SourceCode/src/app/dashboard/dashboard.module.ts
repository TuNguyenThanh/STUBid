import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './dashboard.routes';

import { SharedModule } from '../shared/shared.module';
import { LoadingBar } from '../shared/loading-bar/loading-bar';

import { DashboardComponent } from './dashboard.component';
import { AuctionComponent } from './auction/auction.component';

import { AuthService } from '../service/auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
    AuctionComponent,
  ],
  providers: [
    LoadingBar,
    AuthService,
  ]
})
export class DashboardModule { }

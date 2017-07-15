import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuctionComponent } from './auction/auction.component';

export const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'auction/:auctionId', component: AuctionComponent },
    ]
  },
]
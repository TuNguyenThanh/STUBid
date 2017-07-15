import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './home.routes';

import { HomeComponent } from './home.component';
import { ApiComponent } from './api/api.component';
import { GuideComponent } from './guide/guide.component';

import { AuthService } from '../service/auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    HomeComponent,
    ApiComponent,
    GuideComponent,
  ],
  providers: [AuthService]
})
export class HomeModule { }

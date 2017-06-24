import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BaseService } from './service/base.service';

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ApiComponent } from './api/api.component';
import { GuideComponent } from './guide/guide.component';
import { LoginComponent } from './login/login.component';

import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ApiComponent,
    GuideComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    DashboardModule
  ],
  providers: [BaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }

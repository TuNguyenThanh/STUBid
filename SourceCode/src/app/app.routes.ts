import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' },
    { path: 'dashboard', loadChildren: './home/home.module#HomeModule' },
    { path: 'login', component: LoginComponent },
]
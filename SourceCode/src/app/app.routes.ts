import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApiComponent } from './api/api.component';
import { GuideComponent } from './guide/guide.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'api', component: ApiComponent },
    { path: 'guide', component: GuideComponent }
]
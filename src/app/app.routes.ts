import { Routes } from '@angular/router';
import { LoginComponent } from './demo/pages/login/login.component';
import { DashboardComponent } from './demo/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

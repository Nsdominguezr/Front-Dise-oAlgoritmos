import { Routes } from '@angular/router';
import { LoginComponent } from './demo/pages/login/login.component';
import { DashboardComponent } from './demo/pages/dashboard/dashboard.component';
import { UsuariosComponent } from './demo/pages/usuarios/usuarios.component';
import { AuthGuard } from './guards/auth.guard';

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
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard]
  }
];

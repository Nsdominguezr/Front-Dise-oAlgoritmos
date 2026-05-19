import { Routes } from '@angular/router';
import { LoginComponent } from './demo/pages/login/login.component';
import { DashboardComponent } from './demo/pages/dashboard/dashboard.component';
import { UsuariosComponent } from './demo/pages/usuarios/usuarios.component';
import { SedesComponent } from './demo/pages/sedes/sedes.component';
import { ProductosComponent } from './demo/pages/productos/productos.component';
import { InventarioComponent } from './demo/pages/inventario/inventario.component';
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
  },
  {
    path: 'sedes',
    component: SedesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inventario',
    component: InventarioComponent,
    canActivate: [AuthGuard]
  }
];

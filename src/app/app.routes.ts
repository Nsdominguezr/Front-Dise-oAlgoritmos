import { Routes } from '@angular/router';
import { LoginComponent } from './demo/pages/login/login.component';
import { DashboardComponent } from './demo/pages/dashboard/dashboard.component';
import { UsuariosComponent } from './demo/pages/usuarios/usuarios.component';
import { SedesComponent } from './demo/pages/sedes/sedes.component';
import { ProductosComponent } from './demo/pages/productos/productos.component';
import { InventarioComponent } from './demo/pages/inventario/inventario.component';
import { PedidoComponent } from './demo/pages/pedido/pedido.component';
import { CajaComponent } from './demo/pages/caja/caja.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

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
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin Global'] }
  },
  {
    path: 'sedes',
    component: SedesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin Global'] }
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin Global'] }
  },
  {
    path: 'inventario',
    component: InventarioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin Global', 'Admin Local'] }
  },
  {
    path: 'pedido',
    component: PedidoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin Global', 'Mesero'] }
  },
  {
    path: 'caja',
    component: CajaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin Global', 'Cajero'] }
  }
];

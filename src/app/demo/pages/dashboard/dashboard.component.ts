import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  roles: string[];
  disabled?: boolean;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, ThemeToggleComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    usuario: any = null;
    rol: string | null = null;
    private destroy$ = new Subject<void>();

    menuItems: MenuItem[] = [
        { path: '/productos', icon: '🏷️', label: 'Manage Products', roles: ['Admin Global'] },
        { path: '/pedido', icon: '📋', label: 'Manage Orders', roles: ['Admin Global', 'Mesero'] },
        { path: '/caja', icon: '💰', label: 'Cashier', roles: ['Admin Global', 'Cajero'] },
        { path: '/usuarios', icon: '👥', label: 'Manage Users', roles: ['Admin Global'] },
        { path: '/inventario', icon: '📦', label: 'Manage Inventory', roles: ['Admin Global', 'Admin Local'] },
        { path: '/sedes', icon: '🏪', label: 'Manage Locations', roles: ['Admin Global'] },
        { path: '/mesas', icon: '🪑', label: 'Manage Tables', roles: ['Admin Global', 'Admin Local'] },
        { path: '/historial', icon: '📜', label: 'Payment History', roles: ['Admin Global', 'Cajero'] },
        { path: '/reportes', icon: '📈', label: 'Reports', roles: ['Admin Global'] }
    ];

    filteredMenuItems: MenuItem[] = [];

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.rol = this.authService.getRol();
        this.usuario = this.authService.getUsuario();
        console.log('👤 Usuario cargado:', this.usuario, 'Rol:', this.rol);
        this.filtrarMenuPorRol();
    }

    private filtrarMenuPorRol(): void {
        this.filteredMenuItems = this.menuItems.filter(item =>
            item.roles.includes(this.rol || '')
        );
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject, fromEvent, merge } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
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
    private inactivityTimer: any;
    private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos

    menuItems: MenuItem[] = [
        { path: '/productos', icon: '🏷️', label: 'Manage Products', roles: ['Admin Global'] },
        { path: '/pedido', icon: '📋', label: 'Manage Orders', roles: ['Admin Global', 'Mesero'] },
        { path: '/caja', icon: '💰', label: 'Cashier', roles: ['Admin Global', 'Cajero'] },
        { path: '/usuarios', icon: '👥', label: 'Manage Users', roles: ['Admin Global'] },
        { path: '/inventario', icon: '📦', label: 'Manage Inventory', roles: ['Admin Global', 'Admin Local'] },
        { path: '/sedes', icon: '🏪', label: 'Manage Locations', roles: ['Admin Global'] },
        { path: '/reports', icon: '📈', label: 'Reports', roles: ['Admin Global'], disabled: true }
    ];

    filteredMenuItems: MenuItem[] = [];

    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.usuario = this.authService.getUsuario();
        this.rol = this.authService.getRol();
        console.log('👤 Usuario cargado:', this.usuario, 'Rol:', this.rol);
        this.filtrarMenuPorRol();
        this.setupInactivityTracking();
    }

    private filtrarMenuPorRol(): void {
        this.filteredMenuItems = this.menuItems.filter(item =>
            item.roles.includes(this.rol || '')
        );
    }

    private setupInactivityTracking(): void {
        const events = ['click', 'mousemove', 'keydown', 'scroll'];
        const activity$ = merge(
            ...events.map(event => fromEvent(window, event))
        ).pipe(
            debounceTime(300),
            takeUntil(this.destroy$)
        );

        this.resetInactivityTimer();

        activity$.subscribe(() => {
            console.log('🟢 Actividad detectada, renovando sesión');
            this.resetInactivityTimer();
        });
    }

    private resetInactivityTimer(): void {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        this.inactivityTimer = setTimeout(() => {
            this.logout();
        }, this.INACTIVITY_TIMEOUT);
    }

    logout(): void {
        console.log('🚪 Cerrando sesión por inactividad...');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('usuario');
        this.router.navigate(['/login']);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
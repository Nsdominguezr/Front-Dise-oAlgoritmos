import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    usuario: any = null;
    inactivityTimer: any;
    readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos en milisegundos

    constructor(private router: Router) {}

    ngOnInit(): void {
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            this.usuario = JSON.parse(usuarioStorage);
            console.log('👤 Usuario cargado:', this.usuario);
        }
        this.resetInactivityTimer();
    }

    @HostListener('window:click')
    @HostListener('window:mousemove')
    @HostListener('window:scroll')
    @HostListener('window:keydown')
    onActivity(): void {
        this.resetInactivityTimer();
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
        localStorage.removeItem('usuario');
        this.router.navigate(['/login']);
    }
}

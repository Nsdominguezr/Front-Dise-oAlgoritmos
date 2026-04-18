import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject, fromEvent, merge } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    usuario: any = null;
    private destroy$ = new Subject<void>();
    private inactivityTimer: any;
    private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos

    constructor(private router: Router) {}

    ngOnInit(): void {
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            this.usuario = JSON.parse(usuarioStorage);
            console.log('👤 Usuario cargado:', this.usuario);
        }
        this.setupInactivityTracking();
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
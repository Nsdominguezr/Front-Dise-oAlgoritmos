import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, fromEvent, merge } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private inactivityTimer: any;
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

  constructor(private router: Router, private authService: AuthService) {
    this.setupInactivityTracking();
  }

  private setupInactivityTracking(): void {
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const activity$ = merge(
      ...events.map(event => fromEvent(window, event))
    ).pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    );

    activity$.subscribe(() => {
      console.log('🟢 Actividad detectada, renovando sesión');
      this.resetInactivityTimer();
    });

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

  private logout(): void {
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
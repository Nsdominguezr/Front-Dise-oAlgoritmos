import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip authentication for login and refresh endpoints
    if (req.url.includes('/refresh') || req.url.includes('/login')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();

    if (!token) {
      this.redirectToLogin();
      return throwError(() => new Error('Sin token'));
    }

    // Add Authorization header (setHeaders merges, doesn't replace)
    const cloned = req.clone({
      setHeaders: { 'Authorization': `Bearer ${token}` }
    });

    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.handleUnauthorized(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't try to refresh if we're already on login page
    if (window.location.pathname === '/login') {
      return throwError(() => new Error('Ya estamos en login'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          if (response.token) {
            this.authService.actualizarToken(
              response.token,
              response.expira_en,
              response.usuario,
              response.refresh_token
            );
            this.refreshTokenSubject.next(response.token);
            this.isRefreshing = false;

            const cloned = req.clone({
              setHeaders: { 'Authorization': `Bearer ${response.token}` }
            });
            return next.handle(cloned);
          }

          this.redirectToLogin();
          return throwError(() => new Error(response.mensaje || 'Refresh fallido'));
        }),
        catchError((refreshErr) => {
          this.isRefreshing = false;
          this.redirectToLogin();
          return throwError(() => refreshErr);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const cloned = req.clone({
          setHeaders: { 'Authorization': `Bearer ${token}` }
        });
        return next.handle(cloned);
      })
    );
  }

  private redirectToLogin(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }
}
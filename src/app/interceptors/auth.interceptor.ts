import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔍 Interceptor capturando:', req.method, req.url);

    // Saltar el endpoint de refresh - no necesita token
    if (req.url.includes('/refresh')) {
      console.log('⏭️ Refresh endpoint, sin Authorization header');
      return next.handle(req);
    }

    const token = this.authService.getToken();
    console.log('🔐 Token obtenido:', token ? 'Sí' : 'No');

    if (!token) {
      console.log('⚠️ No hay token, redirigiendo a login');
      this.redirectToLogin();
      return throwError(() => new Error('Sin token'));
    }

    // Crear nuevos headers con Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Clonar request con los nuevos headers
    const cloned = req.clone({ headers });
    console.log('📤 Request clonada con Authorization header');
    console.log('   Headers:', cloned.headers.keys());

    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log('❌ Error HTTP:', err.status, err.statusText);

        if (err.status === 401) {
          console.log('⚠️ Backend rechaza token (401), intentando refresh...');
          return this.handleUnauthorized(req, next);
        }

        console.error('❌ Error:', err.statusText);
        return throwError(() => err);
      })
    );
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          console.log('🔄 Response del refresh:', response);

          if (response.token) {
            this.authService.actualizarToken(
              response.token,
              response.expira_en,
              response.usuario
            );
            this.refreshTokenSubject.next(response.token);
            this.isRefreshing = false;

            const headers = new HttpHeaders({
              'Authorization': `Bearer ${response.token}`
            });
            const cloned = req.clone({ headers });
            console.log('📤 Reenviando request con nuevo token');
            return next.handle(cloned);
          }

          this.redirectToLogin();
          return throwError(() => new Error(response.mensaje || 'Refresh fallido'));
        }),
        catchError((err) => {
          console.error('❌ Error al refrescar token:', err);
          this.isRefreshing = false;
          this.redirectToLogin();
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        const cloned = req.clone({ headers });
        return next.handle(cloned);
      })
    );
  }

  private redirectToLogin(): void {
    console.log('🚪 Redirigiendo a login');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  }
}
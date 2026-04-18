import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      console.log('🔐 Token enviado:', token);
    }

    if (!token) {
      this.redirectToLogin();
      return throwError(() => new Error('Sin token'));
    }

    // Token válido según frontend, clonar con header
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        // Si el backend rechaza con 401, intentar refrescar token
        if (err.status === 401) {
          console.log('⚠️ Backend rechaza token (401), intentando refresh...');
          return this.handleUnauthorized(req, next);
        }

        // Otros errores (500, 503, etc) - mostrar error
        console.error('❌ Error HTTP:', err.status, err.statusText);
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

            // Reenviar petición original con nuevo token
            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`
              }
            });
            return next.handle(cloned);
          }

          // Refresh falló, redirigir a login
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

    // Ya se está refrescando, esperar el nuevo token
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
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
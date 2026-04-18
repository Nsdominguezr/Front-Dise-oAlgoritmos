import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../demo/pages/login/models/login-rs';
import { RespuestaLogin, RespuestaUsuarios } from '../demo/pages/login/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:8000/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<RespuestaLogin> {
    const payload = { username, password };
    return this.http.post<RespuestaLogin>(
      `${this.apiUrl}/login`,
      payload
    );
  }

  registro(credentials: LoginRequest): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(
      `${this.apiUrl}/registro`,
      credentials
    );
  }

  obtenerUsuarios(): Observable<RespuestaUsuarios> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<RespuestaUsuarios>(
      `${this.apiUrl}/usuarios`,
      { headers }
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<any>(
      `${this.apiUrl}/refresh`,
      { refresh_token: refreshToken }
    );
  }

  /**
   * Decodifica el JWT y retorna el payload
   */
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  /**
   * Verifica si el token está expirado (compara en UTC)
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const ahoraUtc = Math.floor(Date.now() / 1000);
    return payload.exp <= ahoraUtc;
  }

  /**
   * Obtiene el token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtiene el refresh_token del localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Guarda tokens del login
   */
  guardarTokens(token: string, refreshToken: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    console.log('💾 Tokens almacenados');
  }

  /**
   * Reemplaza token expirado con uno nuevo
   */
  actualizarToken(nuevoToken: string, expiraEn: string, usuario: any): void {
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    console.log('🔄 Token renovado, expira:', expiraEn);
  }

  /**
   * Verifica si el usuario está autenticado y el token es válido
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }
}
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
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<RespuestaLogin>(
      `${this.apiUrl}/registro`,
      credentials,
      { headers }
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
  actualizarToken(nuevoToken: string, expiraEn: string, usuario: any, nuevoRefreshToken?: string): void {
    localStorage.setItem('token', nuevoToken);
    if (nuevoRefreshToken) {
      localStorage.setItem('refresh_token', nuevoRefreshToken);
    }
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

  /**
   * Verifica si el usuario tiene el rol especificado
   */
  tieneRol(rol: string): boolean {
    const rolActual = this.getRol();
    return rolActual === rol;
  }

  /**
   * Obtiene el user_id del token decodificado
   */
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload?.user_id || null;
  }

  /**
   * Obtiene la sede actual del token decodificado
   */
  getSedeId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload?.sede_id || null;
  }

  /**
   * Obtiene el rol actual del token decodificado
   */
  getRol(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload?.rol || null;
  }

  /**
   * Obtiene el usuario completo del localStorage (para datos extendidos)
   */
  getUsuario(): any | null {
    const usuarioStorage = localStorage.getItem('usuario');
    if (!usuarioStorage) return null;
    try {
      return JSON.parse(usuarioStorage);
    } catch {
      return null;
    }
  }

  /**
   * Verifica si es Admin Global
   */
  esAdminGlobal(): boolean {
    return this.tieneRol('Admin Global');
  }

  /**
   * Verifica si es Admin Local
   */
  esAdminLocal(): boolean {
    return this.tieneRol('Admin Local');
  }

  /**
   * Verifica si es Cajero
   */
  esCajero(): boolean {
    return this.tieneRol('Cajero');
  }

  /**
   * Verifica si es Mesero
   */
  esMesero(): boolean {
    return this.tieneRol('Mesero');
  }

  /**
   * Desactiva un usuario (soft delete)
   */
  desactivarUsuario(usuarioId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(
      `${this.apiUrl}/usuarios/${usuarioId}/desactivar`,
      {},
      { headers }
    );
  }

  /**
   * Descarga reporte CSV
   */
  descargarReporte(tipo: 'inventario' | 'financiero'): Observable<Blob> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(
      `${this.apiUrl}/reportes/${tipo}`,
      {
        headers,
        responseType: 'blob'
      }
    );
  }
}
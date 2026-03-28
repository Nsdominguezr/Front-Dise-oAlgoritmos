import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-rs';
import { RespuestaLogin, RespuestaUsuarios } from '../models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://localhost:8000/api/auth';

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  constructor(private http: HttpClient) { }

  registro(credentials: LoginRequest): Observable<RespuestaLogin> {
    console.log('📤 Enviando registro a:', `${this.apiUrl}/registro`, credentials);
    return this.http.post<RespuestaLogin>(
      `${this.apiUrl}/registro`,
      credentials,
      { headers: this.getHeaders() }
    );
  }

  obtenerUsuarios(): Observable<RespuestaUsuarios> {
    console.log('📤 Obteniendo usuarios de:', `${this.apiUrl}/usuarios`);
    return this.http.get<RespuestaUsuarios>(
      `${this.apiUrl}/usuarios`,
      { headers: this.getHeaders() }
    );
  }

  login(username: string, password: string): Observable<RespuestaLogin> {
    const payload = { username, password };
    console.log('📤 Enviando login a:', `${this.apiUrl}/login`, payload);
    return this.http.post<RespuestaLogin>(
      `${this.apiUrl}/login`,
      payload,
      { headers: this.getHeaders() }
    );
  }
}

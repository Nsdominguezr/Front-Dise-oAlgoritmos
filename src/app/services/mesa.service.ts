import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Mesa {
  id: number;
  numero_mesa: string;
  estado: 'LIBRE' | 'OCUPADA';
  activo?: boolean;
}

export interface CrearMesaRequest {
  sede_id: number;
  numero_mesa: string;
}

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = 'https://localhost:8000/api/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerMesas(sedeId: number): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}/mesas/${sedeId}`, { headers: this.getHeaders() });
  }

  crearMesa(request: CrearMesaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/mesas`, request, { headers: this.getHeaders() });
  }

  eliminarMesa(mesaId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mesas/${mesaId}`, {}, { headers: this.getHeaders() });
  }
}
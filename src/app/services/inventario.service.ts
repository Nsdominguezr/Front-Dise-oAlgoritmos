import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario, MovimientoInventario, MovimientoRequest } from '../demo/pages/inventario/models/inventario.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'https://localhost:8000/api/inventario';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerStockSede(sedeId: number): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.apiUrl}/sede/${sedeId}`, { headers: this.getHeaders() });
  }

  registrarMovimiento(movimiento: MovimientoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/movimiento`, movimiento, { headers: this.getHeaders() });
  }

  obtenerHistorial(sedeId: number): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(`${this.apiUrl}/sede/${sedeId}`);
  }

  /**
   * Simula redistribución de stock entre sedes usando algoritmo voraz
   */
  redistribuirStock(request: {
    producto_id: number;
    stock_disponible: number;
    sedes: Array<{ sede_id: number; nombre: string; capacidad_maxima: number }>;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/redistribuir-stock`, request, { headers: this.getHeaders() });
  }

  /**
   * Descarga reporte de inventario por sede (CSV)
   */
  descargarReporteInventario(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reportes/inventario`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}
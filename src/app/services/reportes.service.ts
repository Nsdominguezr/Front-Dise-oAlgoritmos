import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface HistorialPago {
  pago_id: number;
  pedido_id: number;
  numero_mesa: string;
  usuario_cajero_id: number;
  medio_pago: string;
  monto_cobrado: number;
  fecha_pago: string;
}

export interface OptimizarColaRequest {
  sede_id: number;
  capacidad_items: number;
}

export interface OptimizarColaResponse {
  sede_id: number;
  capacidad_items: number;
  pedidos_seleccionados: number[];
  items_total: number;
  beneficio_total: number;
  pedidos_omitidos: number[];
  total_pedidos_pendientes: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'https://localhost:8000/api/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerHistorialPagos(sedeId: number): Observable<HistorialPago[]> {
    return this.http.get<HistorialPago[]>(`${this.apiUrl}/pagos/historial/${sedeId}`, { headers: this.getHeaders() });
  }

  obtenerReporteFinanciero(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportes/financiero`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  optimizarCola(request: OptimizarColaRequest): Observable<OptimizarColaResponse> {
    return this.http.post<OptimizarColaResponse>(`${this.apiUrl}/optimizar-cola`, request, { headers: this.getHeaders() });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoCaja, CheckoutRequest, CheckoutResponse, PedidoCajaDetalle } from '../models/caja.model';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private apiUrl = 'https://localhost:8000/api/pedidos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // HU-026: Obtener pedidos pendientes de pago
  obtenerPendientes(sedeId: number): Observable<PedidoCaja[]> {
    return this.http.get<PedidoCaja[]>(`${this.apiUrl}/caja/pendientes/${sedeId}`, { headers: this.getHeaders() });
  }

  // HU-029: Obtener detalle de un pedido para cobrar
  obtenerDetallePedido(pedidoId: number): Observable<PedidoCajaDetalle> {
    return this.http.get<PedidoCajaDetalle>(`${this.apiUrl}/${pedidoId}`, { headers: this.getHeaders() });
  }

  // HU-027 y HU-028: Checkout con medio de pago
  procesarCheckout(pedidoId: number, request: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/${pedidoId}/checkout`, request, { headers: this.getHeaders() });
  }
}
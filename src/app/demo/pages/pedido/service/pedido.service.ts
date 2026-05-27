import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa, Pedido, DetallePedido, AbrirPedidoRequest, AgregarItemRequest, PedidoResponse } from '../models/pedido.model';
import { AuthService } from '../../../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'https://localhost:8000/api/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // HU-019: Obtener mesas de una sede
  obtenerMesas(sedeId: number): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}/mesas/${sedeId}`);
  }

  // HU-020: Abrir un pedido
  abrirPedido(request: AbrirPedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.apiUrl}/abrir`, request, { headers: this.getHeaders() });
  }

  // HU-022: Agregar ítem al pedido
  agregarItem(pedidoId: number, request: AgregarItemRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.apiUrl}/${pedidoId}/items`, request, { headers: this.getHeaders() });
  }

  // HU-025: Pasar pedido a caja
  pasarACaja(pedidoId: number): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.apiUrl}/${pedidoId}/pasar-a-caja`, {}, { headers: this.getHeaders() });
  }

  // Obtener pedido con detalles
  obtenerPedido(pedidoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${pedidoId}`, { headers: this.getHeaders() });
  }

  // Obtener pedidos abiertos por sede
  obtenerPedidosAbiertos(sedeId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/abiertos/${sedeId}`, { headers: this.getHeaders() });
  }
}
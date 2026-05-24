import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CajaService } from './service/caja.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { PedidoCaja, PedidoCajaDetalle, CheckoutRequest } from './models/caja.model';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss']
})
export class CajaComponent implements OnInit, OnDestroy {
  // Pedidos pendientes
  pedidosPendientes: PedidoCaja[] = [];

  // Detalle del pedido seleccionado
  pedidoSeleccionado: PedidoCajaDetalle | null = null;

  // Medio de pago
  medioPago: 'EFECTIVO' | 'TC' | 'TD' | '' = '';

  // Usuario y sede
  usuario: any = null;
  sedeId: number | null = null;

  // Estados
  loading = false;
  error = '';
  successMessage = '';
  mostrarConfirmacion = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cajaService: CajaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(usuarioStorage);
      this.sedeId = this.usuario.sede_id || null;
    }

    if (!this.sedeId) {
      this.error = 'No se encontró la sede asignada. Contacte al administrador.';
      this.loading = false;
      return;
    }

    this.obtenerPendientes();
  }

  obtenerPendientes(): void {
    if (!this.sedeId) return;

    this.loading = true;
    this.error = '';
    this.pedidoSeleccionado = null;
    this.medioPago = '';

    this.cajaService.obtenerPendientes(this.sedeId).subscribe({
      next: (response: any) => {
        this.pedidosPendientes = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar pedidos pendientes';
        this.loading = false;
      }
    });
  }

  seleccionarPedido(pedido: PedidoCaja): void {
    this.cajaService.obtenerDetallePedido(pedido.pedido_id).subscribe({
      next: (response: any) => {
        this.pedidoSeleccionado = response;
        this.medioPago = '';
        this.mostrarConfirmacion = true;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar detalle del pedido';
      }
    });
  }

  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.pedidoSeleccionado = null;
    this.medioPago = '';
  }

  procesarCierre(): void {
    if (!this.pedidoSeleccionado || !this.medioPago) {
      this.error = 'Seleccione un medio de pago';
      return;
    }

    const request: CheckoutRequest = {
      medio_pago: this.medioPago
    };

    this.cajaService.procesarCheckout(this.pedidoSeleccionado.id, request).subscribe({
      next: (response: any) => {
        this.successMessage = response.mensaje;
        this.cerrarConfirmacion();
        this.obtenerPendientes();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al procesar el cierre';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  calcularTotal(): number {
    if (!this.pedidoSeleccionado) return 0;
    return this.pedidoSeleccionado.detalles.reduce((sum, item) => {
      return sum + (item.cantidad * Number(item.precio_unitario));
    }, 0);
  }

  puedeCerrar(): boolean {
    return this.medioPago !== '';
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
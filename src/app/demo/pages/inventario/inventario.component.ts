import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventarioService } from '../../../services/inventario.service';
import { SedeService } from '../../../services/sede.service';
import { ProductoService } from '../../../services/producto.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { Inventario, MovimientoRequest } from './models/inventario.model';
import { Sede } from '../sedes/models/sede.model';
import { Producto } from '../productos/models/producto.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  inventarios: Inventario[] = [];
  sedes: Sede[] = [];
  productos: Producto[] = [];
  loading = false;
  error = '';

  sedeSeleccionada: number | null = null;
  mostrarModalIngreso = false;
  mostrarModalMerma = false;
  mostrarHistorial = false;

  formLoading = false;
  formError = '';
  formExito = '';

  productoSeleccionado: number | null = null;
  cantidad = 0;
  observacion = '';

  movimientos: any[] = [];

  constructor(
    private inventarioService: InventarioService,
    private sedeService: SedeService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.obtenerSedes();
    this.obtenerProductos();
  }

  obtenerSedes(): void {
    this.sedeService.obtenerSedes().subscribe({
      next: (response: any) => {
        this.sedes = Array.isArray(response) ? response : [];
        if (this.sedes.length > 0) {
          this.sedeSeleccionada = this.sedes[0].id;
          this.obtenerStock();
        }
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar sedes';
      }
    });
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (response: any) => {
        this.productos = Array.isArray(response) ? response : [];
      },
      error: (err: any) => {
        console.error('Error al cargar productos', err);
      }
    });
  }

  onSedeChange(): void {
    if (this.sedeSeleccionada) {
      this.obtenerStock();
    }
  }

  obtenerStock(): void {
    if (!this.sedeSeleccionada) return;

    this.loading = true;
    this.error = '';

    this.inventarioService.obtenerStockSede(this.sedeSeleccionada).subscribe({
      next: (response: any) => {
        this.inventarios = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar inventario';
        this.loading = false;
      }
    });
  }

  abrirModalIngreso(): void {
    this.mostrarModalIngreso = true;
    this.productoSeleccionado = null;
    this.cantidad = 0;
    this.observacion = '';
    this.formError = '';
    this.formExito = '';
  }

  abrirModalMerma(): void {
    this.mostrarModalMerma = true;
    this.productoSeleccionado = null;
    this.cantidad = 0;
    this.observacion = '';
    this.formError = '';
    this.formExito = '';
  }

  cerrarModal(): void {
    this.mostrarModalIngreso = false;
    this.mostrarModalMerma = false;
    this.resetForm();
  }

  cerrarHistorial(): void {
    this.mostrarHistorial = false;
  }

  resetForm(): void {
    this.productoSeleccionado = null;
    this.cantidad = 0;
    this.observacion = '';
    this.formError = '';
    this.formExito = '';
    this.formLoading = false;
  }

  registrarIngreso(): void {
    if (!this.productoSeleccionado || this.cantidad <= 0) {
      this.formError = 'Seleccione un producto y cantidad válida';
      return;
    }

    const movimiento: MovimientoRequest = {
      sede_id: this.sedeSeleccionada!,
      producto_id: this.productoSeleccionado,
      tipo_movimiento: 'INGRESO',
      cantidad: this.cantidad,
      observacion: this.observacion
    };

    this.formLoading = true;
    this.formError = '';

    this.inventarioService.registrarMovimiento(movimiento).subscribe({
      next: (response: any) => {
        this.formExito = 'Ingreso registrado exitosamente';
        this.formLoading = false;
        setTimeout(() => {
          this.cerrarModal();
          this.obtenerStock();
        }, 1500);
      },
      error: (err: any) => {
        this.formError = err.error?.mensaje || 'Error al registrar ingreso';
        this.formLoading = false;
      }
    });
  }

  registrarMerma(): void {
    if (!this.productoSeleccionado || this.cantidad <= 0) {
      this.formError = 'Seleccione un producto y cantidad válida';
      return;
    }

    const movimiento: MovimientoRequest = {
      sede_id: this.sedeSeleccionada!,
      producto_id: this.productoSeleccionado,
      tipo_movimiento: 'MERMA',
      cantidad: this.cantidad,
      observacion: this.observacion
    };

    this.formLoading = true;
    this.formError = '';

    this.inventarioService.registrarMovimiento(movimiento).subscribe({
      next: (response: any) => {
        this.formExito = 'Merma registrada exitosamente';
        this.formLoading = false;
        setTimeout(() => {
          this.cerrarModal();
          this.obtenerStock();
        }, 1500);
      },
      error: (err: any) => {
        this.formError = err.error?.mensaje || 'Error al registrar merma';
        this.formLoading = false;
      }
    });
  }

  verHistorial(): void {
    if (!this.sedeSeleccionada) return;

    this.mostrarHistorial = true;
    this.inventarioService.obtenerStockSede(this.sedeSeleccionada).subscribe({
      next: (response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          this.movimientos = response[0].movimientos || [];
        } else {
          this.movimientos = [];
        }
      },
      error: (err: any) => {
        console.error('Error al cargar historial', err);
      }
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getProductoNombre(productoId: number): string {
    const producto = this.productos.find(p => p.id === productoId);
    return producto ? producto.nombre : `Producto #${productoId}`;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleString('es-ES');
  }
}
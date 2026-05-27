import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PedidoService } from './service/pedido.service';
import { ProductoService } from '../../../services/producto.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { Mesa, Pedido, DetallePedido } from './models/pedido.model';
import { Producto } from '../productos/models/producto.model';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit, OnDestroy {
  // Mesas
  mesas: Mesa[] = [];
  mesaSeleccionada: Mesa | null = null;

  // Pedido activo
  pedidoActual: any = null;
  detallesPedido: DetallePedido[] = [];

  // Productos y buscador
  productos: Producto[] = [];
  resultadosBusqueda: Producto[] = [];
  terminoBusqueda = '';
  private searchSubject = new Subject<string>();

  // Usuario y sede
  usuario: any = null;
  sedeId: number | null = null;

  // Estados
  loading = false;
  error = '';
  successMessage = '';
  mostrarTicket = false;

  // Variables para agregar item
  cantidadAAgregar = 1;
  productoSeleccionado: Producto | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private pedidoService: PedidoService,
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.sedeId = this.authService.getSedeId();

    if (!this.sedeId) {
      this.error = 'No se encontró la sede asignada. Contacte al administrador.';
      this.loading = false;
      return;
    }

    this.usuario = { id: this.authService.getUserId() };

    this.obtenerMesas();
    this.obtenerProductos();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.buscarProductos(term);
    });
  }

  onSearchChange(event: any): void {
    const term = event.target.value;
    this.searchSubject.next(term);
  }

  buscarProductos(term: string): void {
    if (!term || term.length < 2) {
      this.resultadosBusqueda = [];
      return;
    }

    const termLower = term.toLowerCase();
    this.resultadosBusqueda = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termLower) ||
      (p.categoria && p.categoria.toLowerCase().includes(termLower))
    );
  }

  obtenerMesas(): void {
    if (!this.sedeId) return;

    this.loading = true;
    this.pedidoService.obtenerMesas(this.sedeId).subscribe({
      next: (response: any) => {
        this.mesas = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar mesas';
        this.loading = false;
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

  seleccionarMesa(mesa: Mesa): void {
    if (mesa.estado === 'OCUPADA') {
      // Verificar si hay un pedido abierto para esta mesa
      if (this.sedeId) {
        this.pedidoService.obtenerPedidosAbiertos(this.sedeId).subscribe({
          next: (pedidos: any) => {
            const pedidoMesa = pedidos.find((p: any) => p.mesa_id === mesa.id);
            if (pedidoMesa) {
              this.pedidoActual = pedidoMesa;
              this.cargarDetallesPedido(pedidoMesa.id);
            }
          },
          error: () => {}
        });
      }
      return;
    }

    this.mesaSeleccionada = mesa;
    this.error = '';
    this.abrirPedido(mesa);
  }

  abrirPedido(mesa: Mesa): void {
    if (!this.usuario) return;

    const request = {
      mesa_id: mesa.id,
      usuario_id: this.usuario.id || 1
    };

    this.pedidoService.abrirPedido(request).subscribe({
      next: (response: any) => {
        this.pedidoActual = {
          id: response.pedido_id,
          mesa_id: mesa.id,
          usuario_id: this.usuario.id || 1,
          estado: 'ABIERTO',
          total: 0
        };
        this.detallesPedido = [];

        // Actualizar estado de la mesa en memoria
        const mesaIndex = this.mesas.findIndex(m => m.id === mesa.id);
        if (mesaIndex !== -1) {
          this.mesas[mesaIndex].estado = 'OCUPADA';
        }
        this.mesaSeleccionada = null;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al abrir pedido';
      }
    });
  }

  cargarDetallesPedido(pedidoId: number): void {
    this.pedidoService.obtenerPedido(pedidoId).subscribe({
      next: (response: any) => {
        this.pedidoActual = response;
        this.detallesPedido = response.detalles || [];
      },
      error: () => {}
    });
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.resultadosBusqueda = [];
    this.terminoBusqueda = producto.nombre;
  }

  agregarProducto(): void {
    if (!this.pedidoActual || !this.productoSeleccionado) {
      this.error = 'Seleccione un producto';
      return;
    }

    if (this.cantidadAAgregar <= 0) {
      this.error = 'La cantidad debe ser mayor a 0';
      return;
    }

    const request = {
      producto_id: this.productoSeleccionado.id,
      cantidad: this.cantidadAAgregar,
      precio_unitario: this.productoSeleccionado.precio,
      sede_id: this.sedeId!
    };

    this.pedidoService.agregarItem(this.pedidoActual.id, request).subscribe({
      next: (response: any) => {
        this.successMessage = 'Producto agregado';
        this.pedidoActual.total = response.nuevo_total;

        // Agregar a la lista local
        const existente = this.detallesPedido.find(
          d => d.producto_id === this.productoSeleccionado!.id
        );

        if (existente) {
          existente.cantidad += this.cantidadAAgregar;
        } else {
          this.detallesPedido.push({
            id: Date.now(),
            pedido_id: this.pedidoActual.id,
            producto_id: this.productoSeleccionado!.id,
            cantidad: this.cantidadAAgregar,
            precio_unitario: this.productoSeleccionado!.precio,
            producto_nombre: this.productoSeleccionado!.nombre
          });
        }

        this.resetProductoForm();
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al agregar producto';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  private resetProductoForm(): void {
    this.productoSeleccionado = null;
    this.cantidadAAgregar = 1;
    this.terminoBusqueda = '';
  }

  calcularTotal(): number {
    return this.detallesPedido.reduce((sum, item) => {
      return sum + (item.cantidad * Number(item.precio_unitario));
    }, 0);
  }

  verTicket(): void {
    this.mostrarTicket = true;
  }

  cerrarTicket(): void {
    this.mostrarTicket = false;
  }

  pasarACaja(): void {
    if (!this.pedidoActual) return;

    this.pedidoService.pasarACaja(this.pedidoActual.id).subscribe({
      next: (response: any) => {
        this.successMessage = response.mensaje;

        // Limpiar estado y recargar mesas
        this.pedidoActual = null;
        this.detallesPedido = [];
        this.obtenerMesas();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al pasar a caja';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  getClassEstado(estado: string): string {
    return estado === 'LIBRE' ? 'mesa-libre' : 'mesa-ocupada';
  }

  puedeAgregarItems(): boolean {
    return this.pedidoActual?.estado === 'ABIERTO';
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { Producto, ProductoRequest } from './models/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;
  error = '';

  mostrarModal = false;
  formLoading = false;
  formError = '';
  formExito = '';

  nombre = '';
  precio: number | null = null;
  categoria = '';

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.loading = true;
    this.error = '';

    this.productoService.obtenerProductos().subscribe({
      next: (response: any) => {
        this.productos = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar productos';
        this.loading = false;
      }
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
    this.formError = '';
    this.formExito = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.nombre = '';
    this.precio = null;
    this.categoria = '';
    this.formError = '';
    this.formExito = '';
    this.formLoading = false;
  }

  crearProducto(): void {
    if (!this.nombre) {
      this.formError = 'El nombre es obligatorio';
      return;
    }

    if (this.precio === null || this.precio <= 0) {
      this.formError = 'El precio debe ser un número mayor a 0';
      return;
    }

    const producto: ProductoRequest = {
      nombre: this.nombre,
      precio: this.precio,
      categoria: this.categoria || undefined
    };

    this.formLoading = true;
    this.formError = '';

    this.productoService.crearProducto(producto).subscribe({
      next: (response: any) => {
        this.formExito = response.mensaje || 'Producto creado exitosamente';
        this.formLoading = false;
        setTimeout(() => {
          this.cerrarModal();
          this.obtenerProductos();
        }, 1500);
      },
      error: (err: any) => {
        this.formError = err.error?.mensaje || 'Error al crear producto';
        this.formLoading = false;
      }
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  eliminarProducto(producto: Producto): void {
    if (!confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"? Esta acción lo retirará del catálogo.`)) {
      return;
    }

    this.productoService.desactivarProducto(producto.id).subscribe({
      next: (response: any) => {
        this.error = '';
        alert(response.mensaje || 'Producto eliminado exitosamente');
        this.obtenerProductos();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al eliminar producto';
      }
    });
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
  }
}
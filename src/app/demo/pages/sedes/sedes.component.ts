import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SedeService } from '../../../services/sede.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { Sede, SedeRequest } from './models/sede.model';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit {
  sedes: Sede[] = [];
  loading = false;
  error = '';

  mostrarModal = false;
  formLoading = false;
  formError = '';
  formExito = '';

  nombre = '';
  direccion = '';
  telefono = '';

  constructor(private sedeService: SedeService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.obtenerSedes();
  }

  obtenerSedes(): void {
    this.loading = true;
    this.error = '';

    this.sedeService.obtenerSedes().subscribe({
      next: (response: any) => {
        this.sedes = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar sedes';
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
    this.direccion = '';
    this.telefono = '';
    this.formError = '';
    this.formExito = '';
    this.formLoading = false;
  }

  crearSede(): void {
    if (!this.nombre) {
      this.formError = 'El nombre es obligatorio';
      return;
    }

    const sede: SedeRequest = {
      nombre: this.nombre,
      direccion: this.direccion || undefined,
      telefono: this.telefono || undefined
    };

    this.formLoading = true;
    this.formError = '';

    this.sedeService.crearSede(sede).subscribe({
      next: (response: any) => {
        this.formExito = response.mensaje || 'Sede creada exitosamente';
        this.formLoading = false;
        setTimeout(() => {
          this.cerrarModal();
          this.obtenerSedes();
        }, 1500);
      },
      error: (err: any) => {
        this.formError = err.error?.mensaje || 'Error al crear sede';
        this.formLoading = false;
      }
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
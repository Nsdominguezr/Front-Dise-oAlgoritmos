import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesaService, Mesa, CrearMesaRequest } from '../../../services/mesa.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.scss']
})
export class MesasComponent implements OnInit {
  mesas: Mesa[] = [];
  loading = false;
  error = '';
  successMessage = '';

  mostrarModalCrear = false;
  numeroMesa = '';
  formLoading = false;
  formError = '';

  sedeId: number | null = null;

  constructor(
    private mesaService: MesaService,
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
      return;
    }

    this.obtenerMesas();
  }

  obtenerMesas(): void {
    if (!this.sedeId) return;

    this.loading = true;
    this.error = '';

    this.mesaService.obtenerMesas(this.sedeId).subscribe({
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

  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
    this.numeroMesa = '';
    this.formError = '';
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.numeroMesa = '';
    this.formError = '';
  }

  crearMesa(): void {
    if (!this.numeroMesa.trim()) {
      this.formError = 'El número de mesa es obligatorio';
      return;
    }

    if (!this.sedeId) {
      this.formError = 'No hay sede asignada';
      return;
    }

    const request: CrearMesaRequest = {
      sede_id: this.sedeId,
      numero_mesa: this.numeroMesa.trim()
    };

    this.formLoading = true;
    this.formError = '';

    this.mesaService.crearMesa(request).subscribe({
      next: (response: any) => {
        this.successMessage = response.mensaje;
        this.formLoading = false;
        this.cerrarModalCrear();
        this.obtenerMesas();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: any) => {
        this.formError = err.error?.mensaje || 'Error al crear mesa';
        this.formLoading = false;
      }
    });
  }

  eliminarMesa(mesa: Mesa): void {
    if (mesa.estado === 'OCUPADA') {
      this.error = 'No se puede eliminar una mesa que está ocupada';
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la mesa "${mesa.numero_mesa}"?`)) {
      return;
    }

    this.mesaService.eliminarMesa(mesa.id).subscribe({
      next: (response: any) => {
        this.successMessage = response.mensaje;
        this.error = '';
        this.obtenerMesas();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al eliminar mesa';
      }
    });
  }

  getClassEstado(estado: string): string {
    return estado === 'LIBRE' ? 'mesa-libre' : 'mesa-ocupada';
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
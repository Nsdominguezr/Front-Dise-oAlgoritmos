import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReportesService, HistorialPago } from '../../../services/reportes.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  historial: HistorialPago[] = [];
  loading = false;
  error = '';
  sedeId: number | null = null;

  constructor(
    private reportesService: ReportesService,
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

    this.obtenerHistorial();
  }

  obtenerHistorial(): void {
    if (!this.sedeId) return;

    this.loading = true;
    this.error = '';

    this.reportesService.obtenerHistorialPagos(this.sedeId).subscribe({
      next: (response: any) => {
        this.historial = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al cargar historial de pagos';
        this.loading = false;
      }
    });
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO');
  }

  formatMonto(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(monto);
  }

  getMedioPagoClass(medio: string): string {
    switch (medio) {
      case 'EFECTIVO': return 'badge-efectivo';
      case 'TC': return 'badge-tc';
      case 'TD': return 'badge-td';
      default: return '';
    }
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
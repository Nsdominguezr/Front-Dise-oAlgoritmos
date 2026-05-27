import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportesService, OptimizarColaRequest, OptimizarColaResponse } from '../../../services/reportes.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  loading = false;
  error = '';
  successMessage = '';

  // Optimizar cola
  capacidadItems = 20;
  resultadoOptimizacion: OptimizarColaResponse | null = null;
  optimizacionLoading = false;

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
    }
  }

  descargarReporteFinanciero(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.reportesService.obtenerReporteFinanciero().subscribe({
      next: (csvData: any) => {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_financiero_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.successMessage = 'Reporte descargado exitosamente';
        this.loading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al descargar reporte';
        this.loading = false;
      }
    });
  }

  optimizarCola(): void {
    if (!this.sedeId) return;

    const request: OptimizarColaRequest = {
      sede_id: this.sedeId,
      capacidad_items: this.capacidadItems
    };

    this.optimizacionLoading = true;
    this.error = '';

    this.reportesService.optimizarCola(request).subscribe({
      next: (response: any) => {
        this.resultadoOptimizacion = response;
        this.optimizacionLoading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al optimizar cola';
        this.optimizacionLoading = false;
      }
    });
  }

  limpiarOptimizacion(): void {
    this.resultadoOptimizacion = null;
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
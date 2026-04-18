import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface Usuario {
  id: number;
  username: string;
  rol: {
    id: number;
    nombre: string;
  };
  sede_id: number;
  creado_en: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      console.log('🔐 Token enviado:', token);
    }

    if (!this.authService.isAuthenticated()) {
      console.log('⏰ Token expirado, redirigiendo a login...');
      this.router.navigate(['/login']);
      return;
    }

    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.loading = true;
    this.error = '';

    console.log('📤 Solicitando lista de usuarios...');

    this.authService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta de usuarios:', response);

        if (Array.isArray(response)) {
          this.usuarios = response;
        } else {
          this.usuarios = [];
          this.error = 'Formato de respuesta inesperado';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error al obtener usuarios:', err);
        this.error = err.message || 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getRolClase(rolNombre: string): string {
    const clases: { [key: string]: string } = {
      'Admin Global': 'admin-global',
      'Admin Local': 'admin-local',
      'Cajero': 'cajero',
      'Mesero': 'mesero'
    };
    return clases[rolNombre] || '';
  }

  getSedeNombre(sedeId: number): string {
    const sedes: { [key: number]: string } = {
      1: 'Sede Norte',
      2: 'Sede Centro',
      3: 'Sede Sur'
    };
    return sedes[sedeId] || `Sede ${sedeId}`;
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '-';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
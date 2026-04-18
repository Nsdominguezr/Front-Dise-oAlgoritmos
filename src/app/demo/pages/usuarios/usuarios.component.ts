import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

interface RolOpcion {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error = '';

  // Modal de registro
  mostrarModal = false;
  registroLoading = false;
  registroError = '';
  registroExito = '';

  // Campos del formulario
  registroUsername = '';
  registroPassword = '';
  registroRolId: number | null = null;
  registroSedeId: number | null = null;

  roles: RolOpcion[] = [
    { id: 2, nombre: 'Admin Local' },
    { id: 3, nombre: 'Cajero' },
    { id: 4, nombre: 'Mesero' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.loading = true;
    this.error = '';

    this.authService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.usuarios = response;
        } else {
          this.usuarios = [];
          this.error = 'Formato de respuesta inesperado';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || err.error?.message || 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  // --- Modal de registro ---
  abrirModal(): void {
    this.mostrarModal = true;
    this.registroError = '';
    this.registroExito = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.registroUsername = '';
    this.registroPassword = '';
    this.registroRolId = null;
    this.registroSedeId = null;
    this.registroError = '';
    this.registroExito = '';
    this.registroLoading = false;
  }

  registrarUsuario(): void {
    if (!this.registroUsername || !this.registroPassword || !this.registroRolId || !this.registroSedeId) {
      this.registroError = 'Todos los campos son obligatorios';
      return;
    }

    if (this.registroPassword.length < 6) {
      this.registroError = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.registroLoading = true;
    this.registroError = '';
    this.registroExito = '';

    const payload = {
      username: this.registroUsername,
      password: this.registroPassword,
      rol_id: this.registroRolId,
      sede_id: this.registroSedeId
    };

    this.authService.registro(payload).subscribe({
      next: (response: any) => {
        this.registroLoading = false;
        this.registroExito = response.mensaje || 'Usuario registrado exitosamente';
        setTimeout(() => {
          this.cerrarModal();
          this.obtenerUsuarios();
        }, 1500);
      },
      error: (err: any) => {
        this.registroLoading = false;
        this.registroError = err.error?.mensaje || 'Error al registrar usuario';
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
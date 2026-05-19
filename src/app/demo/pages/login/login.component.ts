import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from './models/login-rs';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, ThemeToggleComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    username = '';
    password = '';
    rol_id = 1;
    sede_id = 1;
    loading = false;
    error = '';
    showPassword = false;
    activeTab: 'login' | 'registro' = 'login';

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  switchTab(tab: 'login' | 'registro'): void {
    this.activeTab = tab;
    this.error = '';
    this.resetForm();
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error = 'Faltan credenciales';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del login:', response);

        if (response.token) {
          this.authService.guardarTokens(
            response.token,
            response.refresh_token,
            response.usuario
          );
          this.resetForm();
          this.router.navigate(['/dashboard']);
        } else {
          this.error = response.mensaje || 'Error al iniciar sesión';
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('❌ Error en la petición:', err);

        let mensajeError = err.error?.mensaje || err.error?.message || 'Error de conexión con el servidor';

        this.error = mensajeError;
        this.loading = false;
      }
    });
  }

  onRegistro(): void {
    if (!this.username || !this.password || !this.rol_id || !this.sede_id) {
      this.error = 'Faltan datos obligatorios';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials: LoginRequest = {
      username: this.username,
      password: this.password,
      rol_id: this.rol_id,
      sede_id: this.sede_id
    };

    this.authService.registro(credentials).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del registro:', response);
        this.activeTab = 'login';
        this.resetForm();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error en la petición:', err);

        let mensajeError = err.error?.mensaje || err.error?.message || 'Error de conexión con el servidor';

        this.error = mensajeError;
        this.loading = false;
      }
    });
  }

  private resetForm(): void {
    this.username = '';
    this.password = '';
    this.rol_id = 1;
    this.sede_id = 1;
    this.showPassword = false;
  }
}
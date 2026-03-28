import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { LoginRequest } from './models/login-rs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
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

  constructor(private loginService: LoginService, private router: Router) {}

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
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

this.loginService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del login:', response);
        
        // Cambiamos la validación: si viene un token, el login fue exitoso
        if (response.token) {
          // Extraemos 'token' y 'usuario' directamente de 'response'
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          
          console.log('✅ Login exitoso');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        } else {
          // Cambiamos 'message' por 'mensaje' según lo que envía tu API
          this.error = response.mensaje || 'Error al iniciar sesión';
          console.log('❌ Error del servidor:', this.error);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error en la petición:', err);
        console.error('Status:', err.status);
        console.error('Body:', err.error);

        let mensajeError = 'Error de conexión con el servidor';

        if (err.status === 0) {
          mensajeError = '🔌 Error de conexión: No se puede conectar al servidor';
        } else if (err.error?.message) {
          mensajeError = err.error.message;
        } else if (err.error?.error) {
          mensajeError = err.error.error;
        } else if (err.statusText) {
          mensajeError = err.statusText;
        }

        this.error = mensajeError;
        this.loading = false;
      }
    });
  }

  onRegistro(): void {
    if (!this.username || !this.password || !this.rol_id || !this.sede_id) {
      this.error = 'Por favor completa todos los campos';
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

    this.loginService.registro(credentials).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del registro:', response);
        if (response.success) {
          this.error = '';
          this.activeTab = 'login';
          this.resetForm();
          console.log('✅ Registro exitoso');
        } else {
          this.error = response.message || 'Error al registrar';
          console.log('❌ Error del servidor:', this.error);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error en la petición:', err);
        console.error('Status:', err.status);
        console.error('Body:', err.error);

        let mensajeError = 'Error de conexión con el servidor';

        if (err.status === 0) {
          mensajeError = '🔌 Error de conexión: No se puede conectar al servidor';
        } else if (err.error?.message) {
          mensajeError = err.error.message;
        } else if (err.error?.error) {
          mensajeError = err.error.error;
        } else if (err.statusText) {
          mensajeError = err.statusText;
        }

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

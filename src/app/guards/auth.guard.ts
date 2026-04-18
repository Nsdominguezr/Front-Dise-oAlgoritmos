import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (token) {
      return true;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
    return false;
  }
}
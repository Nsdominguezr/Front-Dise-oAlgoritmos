import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
usuario: any = null;

constructor(private router: Router) {}

ngOnInit(): void {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
    this.usuario = JSON.parse(usuarioStorage);
    console.log('👤 Usuario cargado:', this.usuario);
    }
}

logout(): void {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
}
}

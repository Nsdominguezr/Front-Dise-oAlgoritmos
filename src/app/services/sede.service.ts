import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede, SedeRequest } from '../demo/pages/sedes/models/sede.model';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private apiUrl = 'https://localhost:8000/api/sedes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.apiUrl);
  }

  crearSede(sede: SedeRequest): Observable<any> {
    return this.http.post(this.apiUrl, sede, { headers: this.getHeaders() });
  }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarServicosService {

  private apiUrl = 'http://localhost:8081/api/servicoExecutado'; // URL do seu endpoint

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  // Aqui você vai adicionar os métodos que interagem com o backend, exemplo:
  registrarServico(dadosServico: any): Observable<any> {
    const headers = this.getHeaders();
    // Endpoint para registrar um serviço, ajuste conforme necessário
    return this.http.post(`${this.apiUrl}/registrarServico`, dadosServico, { headers });
  }
}

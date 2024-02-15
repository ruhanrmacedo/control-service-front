import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = 'http://localhost:8080/api/servicos';

  constructor( private http: HttpClient ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  cadastrarServico(dadosServico: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/cadastrarServico`, dadosServico, { headers });
  }

  getTiposServico(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/tipos-servico`, { headers });
  }
}

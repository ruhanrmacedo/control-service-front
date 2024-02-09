import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = 'http://localhost:8080/api/servicos';

  constructor( private http: HttpClient ) { }

  cadastrarServico(dadosServico: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastrarServico`, dadosServico);
  }

  getTiposServico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-servico`);
  }
}

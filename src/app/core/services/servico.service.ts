import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private apiUrl = 'http://localhost:8081/api/servicos';

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
    return this.http.get<any[]>(`${this.apiUrl}/tipo-servico`, { headers });
  }

  listarServicos(page: number, size: number): Observable<any> {
    const headers = this.getHeaders();
    const params = { params: new HttpParams().set('page', String(page)).set('size', String(size)) };
    return this.http.get<any>(`${this.apiUrl}/listarServicos`, { headers, ...params });
  }

  listarServicosGerente(page: number, size: number): Observable<any> {
    const headers = this.getHeaders();
    const params = { params: new HttpParams().set('page', String(page)).set('size', String(size)) };
    return this.http.get<any>(`${this.apiUrl}/listarServicosGerente`, { headers, ...params });
  }

  editarServico(dadosAtualizados: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/editarServico`, dadosAtualizados, { headers })
  }

  excluirServico(idServico: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/excluirServico/${idServico}`, { headers })
  }
}

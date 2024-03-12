import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tecnico, TecnicoGerente } from '../types/type';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {
  private apiUrl = 'http://localhost:8081/api/tecnicos'

  constructor( private http: HttpClient ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  cadastrarTecnico(dadosTecnico: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/cadastrarTecnico`, dadosTecnico, { headers });
  }

  listarTecnicos(): Observable<{ content: Tecnico[] }> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/listarTecnicos`, { headers });
  }

  listarTodosTecnicos(page: number, size: number): Observable<any> {
    const headers = this.getHeaders();
    const params = { params: new HttpParams().set('page', String(page)).set('size', String(size)) };
    return this.http.get<any>(`${this.apiUrl}/listarTodosTecnicos`, { headers, ...params });
  }

  editarTecnico(dadosAtualizados: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/editarTecnico`, dadosAtualizados, { headers })
  }

  demitirTecnico(idTecnico: number, dataDesligamento: string): Observable<any> {
    const headers = this.getHeaders();
    const body = { idTecnico, dataDesligamento };

    return this.http.put(`${this.apiUrl}/demitirTecnico`, body, { headers })
  }
}

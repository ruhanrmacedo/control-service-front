import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TecnicoService {
  private readonly base = '/api/tecnicos';

  constructor(private http: HttpClient) { }

  cadastrarTecnico(dadosTecnico: any): Observable<any> {
    return this.http.post<any>(`${this.base}/cadastrarTecnico`, dadosTecnico);
  }

  listarTecnicos(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<any>(`${this.base}/listarTecnicos`, { params });
  }

  listarTodosTecnicos(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<any>(`${this.base}/listarTodosTecnicos`, { params });
  }

  editarTecnico(dadosAtualizados: any): Observable<any> {
    return this.http.put<any>(`${this.base}/editarTecnico`, dadosAtualizados);
  }

  demitirTecnico(idTecnico: number, dataDesligamento: string): Observable<any> {
    const body = { idTecnico, dataDesligamento };
    return this.http.put<any>(`${this.base}/demitirTecnico`, body);
  }

  readmitirTecnico(idTecnico: number): Observable<any> {
    return this.http.put<any>(`${this.base}/readmitirTecnico/${idTecnico}`, {});
  }

  buscarTecnicoPorId(idTecnico: number): Observable<any> {
    return this.http.get<any>(`${this.base}/detalharTecnico/${idTecnico}`).pipe(
      tap({
        next: data => console.log('Detalhes do técnico:', data),
        error: err => console.error('Erro ao buscar técnico:', err)
      })
    );
  }
}

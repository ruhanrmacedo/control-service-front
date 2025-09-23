import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  private readonly base = '/api/servicos';

  constructor(private http: HttpClient) { }

  cadastrarServico(dadosServico: any): Observable<any> {
    return this.http.post<any>(`${this.base}/cadastrarServico`, dadosServico);
  }

  getTiposServico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/tipo-servico`);
  }

  listarServicos(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<any>(`${this.base}/listarServicos`, { params });
  }

  listarServicosAtivos(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<any>(`${this.base}/listarServicosAtivos`, { params });
  }

  listarServicosGerente(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<any>(`${this.base}/listarServicosGerente`, { params });
  }

  editarServico(dadosAtualizados: any): Observable<any> {
    return this.http.put<any>(`${this.base}/editarServico`, dadosAtualizados);
  }

  excluirServico(idServico: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/excluirServico/${idServico}`);
  }

  buscarServicoPorId(idServico: number): Observable<any> {
    return this.http.get<any>(`${this.base}/detalharServico/${idServico}`);
  }
}
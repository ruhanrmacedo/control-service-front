import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetalheServicoExecutadoDTO, listarServicosExecutadosAdmDTO, ResumoMensalAdmDTO, ResumoMensalServicoDTO, ServicoExecutadoAdmListagemDTO } from '../types/type';

@Injectable({
  providedIn: 'root'
})
export class RegistrarServicosService {

  private readonly base = '/api/servicoExecutado';

  constructor(private http: HttpClient) { }

  registrarServico(dadosServico: any): Observable<any> {
    return this.http.post<any>(`${this.base}/registrarServico`, dadosServico);
  }

  listarServicosExecutadosAdm(page: number, size: number): Observable<ServicoExecutadoAdmListagemDTO> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<ServicoExecutadoAdmListagemDTO>(`${this.base}/listarServicosExecutadosAdm`, { params });
  }

  listarServicosExecutados(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<any>(`${this.base}/listarServicosExecutados`, { params });
  }

  editarServicoExecutado(dadosAtualizados: any): Observable<any> {
    return this.http.put<any>(`${this.base}/editarServicoExecutado`, dadosAtualizados);
  }

  excluirServicoExecutado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/excluirServicoExecutado/${id}`);
  }

  obterResumoMensal(mes: number, ano: number): Observable<ResumoMensalServicoDTO> {
    const params = new HttpParams()
      .set('mes', String(mes))
      .set('ano', String(ano));
    return this.http.get<ResumoMensalServicoDTO>(`${this.base}/resumoMensal`, { params });
  }

  obterResumoQuinzenal(dataInicio: string, dataFim: string): Observable<ResumoMensalServicoDTO> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<ResumoMensalServicoDTO>(`${this.base}/resumoQuinzenal`, { params });
  }

  listarServicosPorMesEAno(mes: number, ano: number): Observable<any> {
    const params = new HttpParams()
      .set('mes', String(mes))
      .set('ano', String(ano));
    return this.http.get<any>(`${this.base}/listarPorMesEAno`, { params });
  }

  listarServicosPorPeriodo(dataInicio: string, dataFim: string): Observable<any> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<any>(`${this.base}/listarPorPeriodo`, { params });
  }

  calcularResumoMensalAdm(mes: number, ano: number): Observable<ResumoMensalAdmDTO> {
    const params = new HttpParams()
      .set('mes', String(mes))
      .set('ano', String(ano));
    return this.http.get<ResumoMensalAdmDTO>(`${this.base}/calcularResumoMensalAdm`, { params });
  }

  listarServicosDoAdmPorMesEAno(mes: number, ano: number): Observable<listarServicosExecutadosAdmDTO[]> {
    const params = new HttpParams()
      .set('mes', String(mes))
      .set('ano', String(ano));
    return this.http.get<listarServicosExecutadosAdmDTO[]>(`${this.base}/listarServicosAdmPorMesEAno`, { params });
  }

  getDetalheServicoExecutado(id: number): Observable<DetalheServicoExecutadoDTO> {
    return this.http.get<DetalheServicoExecutadoDTO>(`${this.base}/${id}`);
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { listarServicosExecutadosAdmDTO, ResumoMensalAdmDTO, ResumoMensalServicoDTO, ServicoExecutadoAdmListagemDTO } from '../types/type';

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

  // Endpoint para registrar um serviço executado
  registrarServico(dadosServico: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/registrarServico`, dadosServico, { headers });
  }

  listarServicosExecutadosAdm(page: number, size: number): Observable<any>{
    const headers = this.getHeaders();
    const params = { params: new HttpParams().set('page', String(page)).set('size', String(size)) };
    return this.http.get<any>(`${this.apiUrl}/listarServicosExecutadosAdm`, { headers, ...params } );
  }

  listarServicosExecutados(page: number, size: number): Observable<any>{
    const headers = this.getHeaders();
    const params = { params: new HttpParams().set('page', String(page)).set('size', String(size)) };
    return this.http.get<any>(`${this.apiUrl}/listarServicosExecutados`, { headers, ...params } );
  }

  editarServicoExecutado(dadosAtualizados: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/editarServicoExecutado`, dadosAtualizados, { headers })
  }

  excluirServicoExecutado(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/excluirServicoExecutado/${id}`, { headers })
  }

  obterResumoMensal(mes: number, ano: number): Observable<ResumoMensalServicoDTO> {
    const headers = this.getHeaders();
    return this.http.get<ResumoMensalServicoDTO>(`${this.apiUrl}/resumoMensal`, {
      params: new HttpParams().set('mes', mes.toString()).set('ano', ano.toString()),
      headers: headers
    });
  }

  listarServicosPorMesEAno(mes: number, ano: number): Observable<any>{
    const headers = this.getHeaders();
    const params = { params: new HttpParams().set('mes', mes.toString()).set('ano', ano.toString()) };
    return this.http.get<any>(`${this.apiUrl}/listarPorMesEAno`, { headers, ...params });
  }

  //Método para chamar o endpoint de listar serviços por período
  listarServicosPorPeriodo(dataInicio: string, dataFim: string): Observable<any>{
    const headers = this.getHeaders();
    const params = new HttpParams().set('dataInicio', dataInicio).set('dataFim', dataFim);
    return this.http.get<any>(`${this.apiUrl}/listarPorPeriodo`, { headers, params });
}

  calcularResumoMensalAdm(mes: number, ano: number): Observable<ResumoMensalAdmDTO> {
    const headers = this.getHeaders();
    return this.http.get<ResumoMensalAdmDTO>(`${this.apiUrl}/calcularResumoMensalAdm`, {
      params: new HttpParams().set('mes', mes.toString()).set('ano', ano.toString()),
      headers: headers
    });
  }

  listarServicosDoAdmPorMesEAno(mes: number, ano: number): Observable<listarServicosExecutadosAdmDTO[]>{
    const headers = this.getHeaders();
    const params = { params: new HttpParams().set('mes', mes.toString()).set('ano', ano.toString()) };
    return this.http.get<listarServicosExecutadosAdmDTO[]>(`${this.apiUrl}/listarServicosAdmPorMesEAno`, { headers, ...params });
  }
}

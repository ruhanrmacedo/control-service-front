import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComissaoService {
  private readonly base = '/api/comissoaoTecnico';

  constructor(private http: HttpClient) { }

  getContratosExecutados(
    tecnicoId: number,
    mes: number,
    ano: number,
    bonus: boolean
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('tecnicoId', tecnicoId)
      .set('mes', mes)
      .set('ano', ano)
      .set('bonus', String(bonus)); // boolean -> string
    return this.http.get<any[]>(`${this.base}/contratos-executados`, { params });
  }

  // Calcular a comissão total
  calcularComissao(
    tecnicoId: number,
    mes: number,
    ano: number,
    bonus: boolean
  ): Observable<number> {
    const params = new HttpParams()
      .set('tecnicoId', tecnicoId)
      .set('mes', mes)
      .set('ano', ano)
      .set('bonus', String(bonus));
    return this.http.get<number>(`${this.base}/calcular`, { params });
  }

  // Obter os valores executados
  getValoresExecutados(
    tecnicoId: number,
    mes: number,
    ano: number
  ): Observable<{ valorTotal: number; valor1Total: number }> {
    const params = new HttpParams()
      .set('tecnicoId', tecnicoId)
      .set('mes', mes)
      .set('ano', ano);
    return this.http.get<{ valorTotal: number; valor1Total: number }>(
      `${this.base}/valores-executados`,
      { params }
    );
  }

  // Obter a evolução dos valores
  getEvolucaoValor(tecnicoId: number): Observable<any[]> {
    const params = new HttpParams().set('tecnicoId', tecnicoId);
    return this.http.get<any[]>(`${this.base}/evolucao-valor`, { params });
  }

  // Obter a evolução de contratos executados
  getContratosPorTecnico(
    tecnicoId: number,
    mes: number,
    ano: number
  ): Observable<{ tecnicoNome: string; contratosCount: number }[]> {
    const params = new HttpParams()
      .set('tecnicoId', tecnicoId)
      .set('mes', mes)
      .set('ano', ano);
    return this.http.get<{ tecnicoNome: string; contratosCount: number }[]>(
      `${this.base}/evolucao-contratos`,
      { params }
    );
  }
}
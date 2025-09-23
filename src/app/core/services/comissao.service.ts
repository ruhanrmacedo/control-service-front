import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComissaoService {
  private readonly base = '/api/comissaoTecnico';

  constructor(private http: HttpClient) { }

  // Buscar contratos executados
  getContratosExecutados(
    tecnicoId: number,
    mes: number,
    ano: number,
    bonus: boolean
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('tecnicoId', String(tecnicoId))
      .set('mes', String(mes))
      .set('ano', String(ano))
      .set('bonus', String(bonus));
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
      .set('tecnicoId', String(tecnicoId))
      .set('mes', String(mes))
      .set('ano', String(ano))
      .set('bonus', String(bonus));
    return this.http.get<number>(`${this.base}/calcular`, { params });
  }

  // Valores executados
  getValoresExecutados(
    tecnicoId: number,
    mes: number,
    ano: number
  ): Observable<{ valorTotal: number; valor1Total: number }> {
    const params = new HttpParams()
      .set('tecnicoId', String(tecnicoId))
      .set('mes', String(mes))
      .set('ano', String(ano));
    return this.http.get<{ valorTotal: number; valor1Total: number }>(
      `${this.base}/valores-executados`,
      { params }
    );
  }

  // Evolução de valores (gráfico)
  getEvolucaoValor(tecnicoId: number): Observable<any[]> {
    const params = new HttpParams().set('tecnicoId', String(tecnicoId));
    return this.http.get<any[]>(`${this.base}/evolucao-valor`, { params });
  }

  // Evolução de contratos por técnico (gráfico/tabela)
  getContratosPorTecnico(
    tecnicoId: number,
    mes: number,
    ano: number
  ): Observable<{ tecnicoNome: string; contratosCount: number }[]> {
    const params = new HttpParams()
      .set('tecnicoId', String(tecnicoId))
      .set('mes', String(mes))
      .set('ano', String(ano));
    return this.http.get<{ tecnicoNome: string; contratosCount: number }[]>(
      `${this.base}/evolucao-contratos`,
      { params }
    );
  }
}

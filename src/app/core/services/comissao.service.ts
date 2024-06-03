import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComissaoService {
  private apiUrl = 'http://localhost:8081/api/comissaoTecnico'; // URL base do seu backend

  constructor(private http: HttpClient) { }

  // Configura os headers da requisição, incluindo o token de autorização
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Substitua conforme necessário para buscar o token
    });
  }

  // Buscar contratos executados
  getContratosExecutados(tecnicoId: number, mes: number, ano: number, bonus: boolean): Observable<any[]> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('tecnicoId', tecnicoId)
      .set('mes', mes)
      .set('ano', ano)
      .set('bonus', bonus); // Atenção para booleanos, pode precisar de .toString() se o backend espera uma string
    return this.http.get<any[]>(`${this.apiUrl}/contratos-executados`, { headers, params });
  }

  // Calcular a comissão total
  calcularComissao(tecnicoId: number, mes: number, ano: number, bonus: boolean): Observable<number> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('tecnicoId', tecnicoId)
      .set('mes', mes)
      .set('ano', ano)
      .set('bonus', bonus);
    return this.http.get<number>(`${this.apiUrl}/calcular`, { headers, params });
  }

  // Obter os valores executados
  getValoresExecutados(tecnicoId: number, mes: number, ano: number): Observable<{ valorMacedoTotal: number, valorClaroTotal: number }> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('tecnicoId', tecnicoId)
      .set('mes', mes)
      .set('ano', ano);
    return this.http.get<{ valorMacedoTotal: number, valorClaroTotal: number }>(`${this.apiUrl}/valores-executados`, { headers, params });
  }

  // Obter a evolução dos valores
  getEvolucaoValor(tecnicoId: number): Observable<any[]> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('tecnicoId', tecnicoId);
    return this.http.get<any[]>(`${this.apiUrl}/evolucao-valor`, { headers, params });
  }
}

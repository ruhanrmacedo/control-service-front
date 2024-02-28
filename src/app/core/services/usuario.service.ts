import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface CadastroUsuario {
  nome: string;
  cpf: string;
  login: string;
  senha: string;
  tipoUsuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8081/api/usuarios';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  cadastrarUsuario(usuario: CadastroUsuario): Observable<any> {
    const headers = this.getHeaders(); // Use o método getHeaders aqui
    return this.http.post(`${this.apiUrl}/cadastrarUsuario`, usuario, { headers }).pipe(
      catchError(error => {
        const erroResponse = error.error;
        return throwError(() => erroResponse);
      })
    );
  }

  getCurrentUserName(): string {
    return localStorage.getItem(`userName`) || '';
  }

  getTipoUsuario(): string {
    return localStorage.getItem(`tipoUsuario`) || '';
  }

  getUsuarioById(id: number): Observable<any> {
    const headers = this.getHeaders(); // Use o método getHeaders aqui
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  editarUsuario(dadosAtualizados: any): Observable<any> {
    const headers = this.getHeaders(); // Método getHeaders já definido
    return this.http.put<any>(`${this.apiUrl}/editarUsuario`, dadosAtualizados, { headers });
  }

  listarTodosUsuarios(): Observable<any> {
    const headers = this.getHeaders(); // Use o método getHeaders aqui
    return this.http.get<any>(`${this.apiUrl}/listarTodosUsuarios`, { headers });
  }

  desligarUsuario(id: number, dataInativacao: string): Observable<any> {
    const headers = this.getHeaders();
    const body = { id, dataInativacao };

    return this.http.put(`${this.apiUrl}/desligarUsuario`, body, { headers });
  }

  alterarSenhaUsuarioSelecionado(dadosSenha: { novaSenha: string, confirmarSenha: string }, usuarioId: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/alterarSenhaUsuarioSelecionado/${usuarioId}`;
  
    // O corpo da requisição deve conter apenas 'novaSenha' e 'confirmarSenha', conforme esperado pelo backend.
    const body = {
      novaSenha: dadosSenha.novaSenha,
      confirmarSenha: dadosSenha.confirmarSenha
    };
  
    return this.http.put<void>(url, body, { headers });
  }
  
}


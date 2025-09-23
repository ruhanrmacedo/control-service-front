import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface CadastroUsuario {
  nome: string;
  cpf: string;
  login: string;
  senha: string;
  tipoUsuario: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = '/api/usuarios';

  constructor(private http: HttpClient) { }

  cadastrarUsuario(usuario: CadastroUsuario): Observable<any> {
    return this.http.post<any>(`${this.base}/cadastrarUsuario`, usuario).pipe(
      catchError(error => throwError(() => error.error))
    );
  }

  getCurrentUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  getTipoUsuario(): string {
    return localStorage.getItem('tipoUsuario') || '';
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  editarUsuario(dadosAtualizados: any): Observable<any> {
    return this.http.put<any>(`${this.base}/editarUsuario`, dadosAtualizados);
  }

  listarTodosUsuarios(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http.get<any>(`${this.base}/listarTodosUsuarios`, { params });
  }

  desligarUsuario(id: number, dataInativacao: string): Observable<any> {
    const body = { id, dataInativacao };
    return this.http.put<any>(`${this.base}/desligarUsuario`, body);
  }

  alterarSenhaUsuarioSelecionado(
    dadosSenha: { novaSenha: string; confirmarSenha: string },
    usuarioId: number
  ): Observable<void> {
    const body = {
      novaSenha: dadosSenha.novaSenha,
      confirmarSenha: dadosSenha.confirmarSenha
    };
    return this.http.put<void>(`${this.base}/alterarSenhaUsuarioSelecionado/${usuarioId}`, body);
  }

  readmitirUsuario(id: number): Observable<any> {
    return this.http.put<any>(`${this.base}/readmitirUsuario/${id}`, null).pipe(
      catchError(error => throwError(() => error.error))
    );
  }
}

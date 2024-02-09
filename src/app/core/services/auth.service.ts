import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Usuario } from '../types/type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioAtualSubject = new BehaviorSubject<any>(null);
  private usuarioAtual = this.usuarioAtualSubject.asObservable();

  private apiURL = '/api/login/efetuarLogin'

  constructor(private http: HttpClient) { 
    this.usuarioAtualSubject.next({
      nome: localStorage.getItem('usuarioLogado'),
      cpf: localStorage.getItem('cpfUsuarioLogado'),
      login: localStorage.getItem('loginUsuarioLogado'),
    })
  }

  login(login: string, senha: string) {
    return this.http.post<any>(this.apiURL, { login: login, senha}).pipe(
      tap(resposta => {
        localStorage.setItem('token', resposta.token);
        this.fetchCurrentUsuarioLogado();
      }),
      catchError(error => {
        return throwError(error.error);
      })
    );
  }

  //Buscar o nome do usuário após o login
  fetchCurrentUsuarioLogado(): void {
    this.http.get<any>('/api/usuarios/usuarioAtual').subscribe(response => {
      localStorage.setItem('usuarioLogado', response.nome);
      localStorage.setItem('cpfUsuarioLogado', response.cpf);
      localStorage.setItem('loginUsuarioLogado', response.login);
      localStorage.setItem('tipoUsuarioLogado', response.tipoUsuario);
      localStorage.setItem('usuarioId', response.id); // Armazena o ID do usuário
      console.log('ID do usuário armazenado:', response.id);
    })
  }

  getCurrentUsuarioLogado(): string {
    return localStorage.getItem('usuarioLogado') || '';
  }
  
  getCurrentUsuarioId(): number {
    const usuarioId = localStorage.getItem('usuarioId');
    return usuarioId !== null ? Number(usuarioId) : 0;
  }

  getCurrentCpfUsuarioLogado(): string {
    return localStorage.getItem('cpfUsuarioLogado') || '';
  }

  getCurrentLoginUsuarioLogado(): string {
    return localStorage.getItem('loginUsuarioLogado') || '';
  }

  getCurrentTipoUsuarioLogado(): string {
    return localStorage.getItem('tipoUsuarioLogado') || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  atualizarUsuario(dadosAtualizados: any): Observable<any> {
    const url = '/api/usuarios/editarUsuario'; 
    return this.http.put<any>(url, dadosAtualizados);
  }

  public atualizarInformacoesUsuarioLogado(usuario: any): void {
    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('cpfUsuarioLogado', usuario.cpf);
    localStorage.setItem('loginUsuarioLogado', usuario.login);
  }

  listarTodosUsuarios(): Observable<{ content: Usuario[] }> {
    return this.http.get<any>('/api/usuarios/listarTodosUsuarios');
  }

  alterarSenha(dados: { id: number, novaSenha: string, confirmarSenha: string }): Observable<void> {
    const params = new HttpParams()
    .set('novaSenha', dados.novaSenha)
    .set('confirmarSenha', dados.confirmarSenha);
    
    const url = `/api/usuarios/alterarSenha?id=${dados.id}`; 

    return this.http.put<void>(url, {}, {params });
  }


}

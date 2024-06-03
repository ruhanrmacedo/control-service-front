import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Usuario } from '../types/type';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioAtualSubject = new BehaviorSubject<any>(null);
  public usuarioAtual = this.usuarioAtualSubject.asObservable();
  public logoutEvent = new EventEmitter<void>();

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
      this.usuarioAtualSubject.next(response); // Atualiza o BehaviorSubject
      console.log('ID do usuário armazenado:', response.id);
    })
  }

  // Métodos para obter informações do usuário logado a partir do localStorage
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

  // Método para logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('cpfUsuarioLogado');
    localStorage.removeItem('loginUsuarioLogado');
    localStorage.removeItem('tipoUsuarioLogado');
    localStorage.removeItem('usuarioId');
    this.logoutEvent.emit(); // Emitir evento de logout
    this.usuarioAtualSubject.next(null); // Atualiza o BehaviorSubject
  }

  // Atualiza informações do usuário
  atualizarUsuario(dadosAtualizados: any): Observable<any> {
    const url = '/api/usuarios/editarUsuario'; 
    return this.http.put<any>(url, dadosAtualizados);
  }

  // Atualiza as informações do usuário logado no localStorage
  public atualizarInformacoesUsuarioLogado(usuario: any): void {
    localStorage.setItem('usuarioLogado', usuario.nome);
    localStorage.setItem('cpfUsuarioLogado', usuario.cpf);
    localStorage.setItem('loginUsuarioLogado', usuario.login);
    localStorage.setItem('tipoUsuarioLogado', usuario.tipoUsuario);
    this.usuarioAtualSubject.next(usuario);
  }

  // Verifica se o usuário é Gerente ou Root
  public isGerenteOuRoot(): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuarioLogado');
    return tipoUsuario === 'GERENTE' || tipoUsuario === 'ROOT';
  }

  // Lista todos os usuários para Gerente ou ROOT
  listarTodosUsuarios(): Observable<{ content: Usuario[] }> {
    return this.http.get<any>('/api/usuarios/listarTodosUsuarios');
  }

  // Altera a senha do usuário
  alterarSenha(dados: { id: number, novaSenha: string, confirmarSenha: string }): Observable<void> {
    const params = new HttpParams()
    .set('novaSenha', dados.novaSenha)
    .set('confirmarSenha', dados.confirmarSenha);
    
    const url = `/api/usuarios/alterarSenha?id=${dados.id}`; 

    return this.http.put<void>(url, {}, {params });
  }

  // Verifica se o token JWT expirou
  tokenExpirou(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);  // Uso correto da função importada
      const agora = new Date();
      const expiracao = new Date(decoded.exp * 1000); // JWT exp é em segundos
      return agora > expiracao;
    }
    return true;
  }


}

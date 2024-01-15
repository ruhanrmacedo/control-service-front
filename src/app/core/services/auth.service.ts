import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = '/api/login/efetuarLogin'

  constructor(private http: HttpClient) { }

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
    })
  }

  getCurrentUsuarioLogado(): string {
    return localStorage.getItem('usuarioLogado') || '';
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
}

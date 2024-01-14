import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

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
        this.fetchCurrentUserName();
      })
    );
  }

  //Buscar o nome do usuário após o login
  fetchCurrentUserName(): void {
    this.http.get<any>('/api/usuarios/usuarioAtual').subscribe(response => {
      localStorage.setItem('userName', response.nome);
    })
  }

  getCurrentUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

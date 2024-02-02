import { HttpClient } from '@angular/common/http';
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

  cadastrarUsuario(usuario: CadastroUsuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastrarUsuario`, usuario).pipe(
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
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  editarUsuario(id: number, dadosAtualizados: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/editarUsuario/${id}`, dadosAtualizados);
  }

  listarTodosUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/listarTodosUsuarios`);
  }
}

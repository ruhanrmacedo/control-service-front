import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8081/api/usuarios/cadastrarUsuario';

  constructor(private http: HttpClient) { }

  cadastrarUsuario(usuario: CadastroUsuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario)
  }
}

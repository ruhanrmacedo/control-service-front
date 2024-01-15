import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  nome: string = '';
  cpf: string = '';
  login: string = '';

  constructor(
    private authService: AuthService, 
    public dialog: MatDialog) {
  }

  get usuarioLogado(): string {
    return this.authService.getCurrentUsuarioLogado();
  }

  get cpfUsuarioLogado(): string {
    return this.authService.getCurrentCpfUsuarioLogado();
  }

  get loginUsuarioLogado(): string {
    return this.authService.getCurrentLoginUsuarioLogado();
  }

  get tipoUsuarioLogado(): string {
    return this.authService.getCurrentTipoUsuarioLogado();
  }

  abrirModalEdicao(): void {

  }

  abrirModalAlterarSenha(): void {

  }



}

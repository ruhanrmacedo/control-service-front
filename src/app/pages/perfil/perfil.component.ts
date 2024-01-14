import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  usuario: any;
  constructor(private authService: AuthService, public dialog: MatDialog) {
    const usuario = {
      nome: 'Nome do Usuário',
      cpf: '000.000.000-00',
      login: 'usuario.login',
      tipoUsuario: 'Tipo do Usuário'
    };

  }

  abrirModalEdicao(): void {

  }

  abrirModalAlterarSenha(): void {

  }



}

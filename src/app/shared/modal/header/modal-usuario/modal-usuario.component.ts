import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService, CadastroUsuario } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent {

  nome: string = '';
  cpf: string = '';
  login: string = '';
  senha: string = '';
  tipoUsuario: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalUsuarioComponent>,
    private usuarioService: UsuarioService
  ) {}

  onSubmit(): void {
    const usuario: CadastroUsuario = {
      nome: this.nome,
      cpf: this.cpf,
      login: this.login,
      senha: this.senha,
      tipoUsuario: this.tipoUsuario
    };

    this.usuarioService.cadastrarUsuario(usuario).subscribe({
      next: (data) => {
        console.log('Usuário cadastrado com sucesso!', data);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Erro ao cadastrar usuário', error);
      }
    });
  }

  limparFormulario(): void {
    this.nome = '';
    this.cpf = '';
    this.login = '';
    this.senha = '';
    this.tipoUsuario = '';
  }
}

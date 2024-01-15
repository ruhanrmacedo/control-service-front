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
  cadastroSucesso: boolean = false;
  erroCadastro: boolean = false;
  mensagemErro: string = '';
  

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
        this.cadastroSucesso = true;
        localStorage.setItem('userName', data.nome);
        localStorage.setItem('tipoUsuario', data.tipoUsuario)
        //this.dialogRef.close();
      },
      error: (erroResponse) => {
        console.error('Erro ao cadastrar usuário', erroResponse);
        //this.cadastroSucesso = false;
        this.erroCadastro = true;
        this.mensagemErro = erroResponse
          .map((erro: { campo: any; mensagem: any; }) => `${erro.campo}: ${erro.mensagem}`)
          .join(', ');
      }
    });
  }

  get userName(): string {
    return this.usuarioService.getCurrentUserName();
  }

  get userTipoUsuario(): string {
    return this.usuarioService.getTipoUsuario();
  }

  limparFormulario(): void {
    this.nome = '';
    this.cpf = '';
    this.login = '';
    this.senha = '';
    this.tipoUsuario = '';
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  fecharModalErro(): void {
    this.erroCadastro = false;
    this.mensagemErro = '';
  }

}

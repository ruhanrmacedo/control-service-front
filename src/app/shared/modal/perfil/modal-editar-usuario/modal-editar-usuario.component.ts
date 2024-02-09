import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-modal-editar-usuario',
  templateUrl: './modal-editar-usuario.component.html',
  styleUrls: ['./modal-editar-usuario.component.scss']
})
export class ModalEditarUsuarioComponent {

  editadoComSucesso: boolean = false;
  erroEditar: boolean = false;
  erroSenha: boolean = false;
  mensagemErro: string = '';
  

  constructor(
    private dialogRef: MatDialogRef<ModalEditarUsuarioComponent>,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  salvarAlteracoes(): void {
    const dadosAtualizados = {
      id: this.data.usuarioId,
      nome: this.data.nome,
      cpf: this.data.cpf,
      login: this.data.login,
    };
    this.usuarioService.editarUsuario(dadosAtualizados)
    .subscribe({
      next: (res) => {
        // Tratar sucesso
        this.editadoComSucesso = true;
        alert('Usuário atualizado com sucesso');
        this.dialogRef.close(true);
      },
      error: (erro) => {
        // Tratar erros
        this.erroEditar = true;
        this.mensagemErro = 'Erro ao atualizar usuário';
        console.error('Erro ao atualizar', erro);
      }
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  fecharModalErro(): void {
    this.erroSenha = false;
    this.mensagemErro = '';
  }
}

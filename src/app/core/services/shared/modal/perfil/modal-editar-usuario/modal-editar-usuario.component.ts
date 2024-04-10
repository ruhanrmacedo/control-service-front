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
  mostrarAlterarSenha: boolean = false;
  novaSenha: string = '';
  confirmarSenha: string = '';
  alterarSenhaSucesso: boolean = false;
  

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

  mostrarFormAlterarSenha(): void {
    this.mostrarAlterarSenha = !this.mostrarAlterarSenha;
    console.log("mostrarAlterarSenha:", this.mostrarAlterarSenha);
  }

  alterarSenha(event: Event): void {
    event.preventDefault();

    console.log('ID do Usuário:', this.data.usuarioId);
    console.log('Nova Senha:', this.novaSenha);
    console.log('Confirmar Senha:', this.confirmarSenha);

    // Verifica se as senhas coincidem
    if (this.novaSenha !== this.confirmarSenha) {
      this.erroSenha = true;
      this.mensagemErro = 'As senhas não coincidem!';
      return;
    }

    // Prepara os dados para alteração de senha
    const dadosSenha = {
      novaSenha: this.novaSenha,
      confirmarSenha: this.confirmarSenha
    };

    // Chama o serviço para alterar a senha
    this.usuarioService.alterarSenhaUsuarioSelecionado(dadosSenha, this.data.usuarioId).subscribe({
      next: () => {
        alert('Senha alterada com sucesso!');
        this.dialogRef.close(true);
      },
      error: (erro) => {
        this.erroSenha = true;
        this.mensagemErro = 'Erro ao alterar a senha';
        console.error('Erro ao alterar senha', erro);
      }
    });

  }

  limparFormulario(): void {
    this.novaSenha = '';
    this.confirmarSenha = '';
  }
}

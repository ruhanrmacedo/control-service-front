import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-modal-alterar-senha',
  templateUrl: './modal-alterar-senha.component.html',
  styleUrls: ['./modal-alterar-senha.component.scss']
})
export class ModalAlterarSenhaComponent {

  novaSenha: string = '';
  confirmarSenha: string = '';
  alterarSenhaSucesso: boolean = false;
  erroSenha: boolean = false;
  mensagemErro: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalAlterarSenhaComponent>,
    private authService: AuthService
  ) { }

  limparFormulario(): void {
    this.novaSenha = '';
    this.confirmarSenha = '';
  }

  alterarSenha(): void {
    const usuarioId = this.authService.getCurrentUsuarioId();
    console.log('ID do Usuário:', usuarioId);

    if (usuarioId) {
      const dadosAtualizados = {
        id: usuarioId,
        novaSenha: this.novaSenha,
        confirmarSenha: this.confirmarSenha
      };

      this.authService.alterarSenha(dadosAtualizados).subscribe(
        () => {
          this.alterarSenhaSucesso = true;
          this.dialogRef.close();
        },
        (error: { message: string; }) => {
          this.erroSenha = true;
          this.mensagemErro = error.message;
        }
      )
    }

  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  fecharModalErro(): void {
    this.erroSenha = false;
    this.mensagemErro = '';
  }
}

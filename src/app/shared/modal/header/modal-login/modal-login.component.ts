import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss']
})
export class ModalLoginComponent {
  
  @Output() loginSuccess = new EventEmitter<void>();
  login: string = '';
  senha: string = '';
  loginSucesso: boolean = false;
  tipoUsuario: string = '';
  erroLogin: boolean = false;
  mensagemErro: string = '';

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<ModalLoginComponent>,

  ) { }

  onLogin(): void {
    this.authService.login(this.login, this.senha).subscribe({
      next: (data) => {
        this.loginSucesso = true;
        this.tipoUsuario = data.tipoUsuario;
        localStorage.setItem('token', data.token);
        this.loginSuccess.emit(); // Emitir evento de sucesso de login
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Erro no login', error);
        this.erroLogin = true;
        if (typeof error === 'string') {
          this.mensagemErro = error;
        } else if (error && error.error) {
          this.mensagemErro = error.error;
        } else {
          this.mensagemErro = 'Erro desconhecido ao tentar fazer login';
        }
      }
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  limparFormulario(): void {
    this.login = '';
    this.senha = '';
  }

  get usuarioLogado(): string {
    return this.authService.getCurrentUsuarioLogado();
  }

  fecharModalErro(): void {
    this.erroLogin = false;
    this.mensagemErro = '';
  }
}

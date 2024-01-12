import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss']
})
export class ModalLoginComponent {
  
  login: string = '';
  senha: string = '';
  loginSucesso: boolean = false;
  tipoUsuario: string = '';

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
      },
      error: (error) => {
        console.error('Erro no login', error);
      },
      complete: () => {
        // Código a ser executado quando a Observable é concluída
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
}

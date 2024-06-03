import { Component, OnInit } from '@angular/core';
import { ModalLoginComponent } from '../modal/header/modal-login/modal-login.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../modal/header/modal-usuario/modal-usuario.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor (
    private router: Router, 
    public dialog: MatDialog, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.fetchCurrentUsuarioLogado();
    this.authService.logoutEvent.subscribe(() => {
      window.location.reload(); // Recarregar a página após logout
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get usuarioLogado(): string {
    return this.authService.getCurrentUsuarioLogado();
  }

  logout(): void {
    this.authService.logout();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(ModalLoginComponent, {
      width: '50%' // ou qualquer outra largura que você preferir
    });

    dialogRef.componentInstance.loginSuccess.subscribe(() => {
      window.location.reload(); // Recarrega a página após o login bem-sucedido
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openUsuarioDialog(): void {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '50%' // ou qualquer outra largura que você preferir
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed'); // Lógica após fechar o diálogo, se necessário
    });

  }

  navigateToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  get isRootOrGerente(): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuarioLogado');
    return tipoUsuario === 'ROOT' || tipoUsuario === 'GERENTE';
  }
}

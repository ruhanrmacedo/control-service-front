import { Component } from '@angular/core';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public dialog: MatDialog, private authService: AuthService) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string {
    return this.authService.getCurrentUserName();
  }

  logout(): void {
    this.authService.logout();
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(ModalLoginComponent, {
      width: '50%' // ou qualquer outra largura que você preferir
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed'); // Lógica após fechar o diálogo, se necessário
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
}

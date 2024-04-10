import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-servicos',
  templateUrl: './card-servicos.component.html',
  styleUrls: ['./card-servicos.component.scss'],
})
export class CardServicosComponent {
  constructor ( private router: Router ) {}

  navigateToRegistrarServico(): void {
    this.router.navigate(['/registrar-servicos']);
  }
}
 
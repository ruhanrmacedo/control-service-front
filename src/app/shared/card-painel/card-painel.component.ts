import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-painel',
  templateUrl: './card-painel.component.html',
  styleUrls: ['./card-painel.component.scss']
})
export class CardPainelComponent {
  constructor ( private router: Router ) {}

  navigateToPainel(): void {
    this.router.navigate(['/painel']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-gratificacao',
  templateUrl: './card-gratificacao.component.html',
  styleUrls: ['./card-gratificacao.component.scss']
})
export class CardGratificacaoComponent {
  constructor ( private router: Router ) {}

  navigateToGratificacao(): void {
    this.router.navigate(['/gratificacao']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-controle-km',
  templateUrl: './card-controle-km.component.html',
})
export class CardControleKmComponent {
  constructor ( private router: Router ) {}

  navigateToGratificacao(): void {
    this.router.navigate(['/gratificacao']);
  }
}

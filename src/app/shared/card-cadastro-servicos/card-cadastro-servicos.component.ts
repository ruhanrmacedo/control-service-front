import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-cadastro-servicos',
  templateUrl: './card-cadastro-servicos.component.html',
  styleUrls: ['./card-cadastro-servicos.component.scss']
})
export class CardCadastroServicosComponent {
  constructor ( private router: Router) {}

  navigateToServico(): void {
    this.router.navigate(['/servico'])
  }

}

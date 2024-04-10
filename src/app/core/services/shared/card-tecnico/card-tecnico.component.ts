import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-tecnico',
  templateUrl: './card-tecnico.component.html',
  styleUrls: ['./card-tecnico.component.scss']
})
export class CardTecnicoComponent {
  constructor (private router:  Router) {}


  navigateToTecnico(): void {
    this.router.navigate(['/tecnico']);
  }

}

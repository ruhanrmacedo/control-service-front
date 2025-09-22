import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  year = new Date().getFullYear();

  links = {
    linkedin: 'https://www.linkedin.com/in/ruhan-macedo-4a25a3182/',
    instagram: 'https://www.instagram.com/ruhanrmacedo/',
    whatsapp: 'https://wa.me/5548991351845?text=Ol%C3%A1!%20Vim%20pelo%20site%20Control%20Service.'
  };
}

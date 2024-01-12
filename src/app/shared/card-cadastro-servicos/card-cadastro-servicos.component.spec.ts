import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCadastroServicosComponent } from './card-cadastro-servicos.component';

describe('CardCadastroServicosComponent', () => {
  let component: CardCadastroServicosComponent;
  let fixture: ComponentFixture<CardCadastroServicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCadastroServicosComponent]
    });
    fixture = TestBed.createComponent(CardCadastroServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

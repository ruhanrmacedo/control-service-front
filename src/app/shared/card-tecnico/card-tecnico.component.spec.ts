import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTecnicoComponent } from './card-tecnico.component';

describe('CardTecnicoComponent', () => {
  let component: CardTecnicoComponent;
  let fixture: ComponentFixture<CardTecnicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardTecnicoComponent]
    });
    fixture = TestBed.createComponent(CardTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

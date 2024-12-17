import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGratificacaoComponent } from './card-gratificacao.component';

describe('CardGratificacaoComponent', () => {
  let component: CardGratificacaoComponent;
  let fixture: ComponentFixture<CardGratificacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardGratificacaoComponent]
    });
    fixture = TestBed.createComponent(CardGratificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

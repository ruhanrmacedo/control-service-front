import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPainelComponent } from './card-painel.component';

describe('CardPainelComponent', () => {
  let component: CardPainelComponent;
  let fixture: ComponentFixture<CardPainelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardPainelComponent]
    });
    fixture = TestBed.createComponent(CardPainelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPainelComponent } from './card-painel.component';

describe('CardPainelComponent', () => {
  let component: CardPainelComponent;
  let fixture: ComponentFixture<CardPainelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPainelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardPainelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardControleKmComponent } from './card-controle-km.component';

describe('CardControleKmComponent', () => {
  let component: CardControleKmComponent;
  let fixture: ComponentFixture<CardControleKmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardControleKmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardControleKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

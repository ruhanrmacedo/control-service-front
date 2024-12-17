import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratificacaoComponent } from './gratificacao.component';

describe('PainelComponent', () => {
  let component: GratificacaoComponent;
  let fixture: ComponentFixture<GratificacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GratificacaoComponent]
    });
    fixture = TestBed.createComponent(GratificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

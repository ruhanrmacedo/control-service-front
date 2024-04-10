import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComissaoComponent } from './modal-comissao.component';

describe('ModalComissaoComponent', () => {
  let component: ModalComissaoComponent;
  let fixture: ComponentFixture<ModalComissaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComissaoComponent]
    });
    fixture = TestBed.createComponent(ModalComissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

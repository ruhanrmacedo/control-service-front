import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarServicoComponent } from './modal-editar-servico.component';

describe('ModalEditarServicoComponent', () => {
  let component: ModalEditarServicoComponent;
  let fixture: ComponentFixture<ModalEditarServicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditarServicoComponent]
    });
    fixture = TestBed.createComponent(ModalEditarServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

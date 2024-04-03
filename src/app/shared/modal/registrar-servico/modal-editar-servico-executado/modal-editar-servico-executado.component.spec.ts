import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarServicoExecutadoComponent } from './modal-editar-servico-executado.component';

describe('ModalEditarServicoExecutadoComponent', () => {
  let component: ModalEditarServicoExecutadoComponent;
  let fixture: ComponentFixture<ModalEditarServicoExecutadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditarServicoExecutadoComponent]
    });
    fixture = TestBed.createComponent(ModalEditarServicoExecutadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

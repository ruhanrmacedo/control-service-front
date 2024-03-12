import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarTecnicoComponent } from './modal-editar-tecnico.component';

describe('ModalEditarTecnicoComponent', () => {
  let component: ModalEditarTecnicoComponent;
  let fixture: ComponentFixture<ModalEditarTecnicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditarTecnicoComponent]
    });
    fixture = TestBed.createComponent(ModalEditarTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

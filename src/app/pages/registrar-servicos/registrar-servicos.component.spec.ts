import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarServicosComponent } from './registrar-servicos.component';

describe('RegistrarServicosComponent', () => {
  let component: RegistrarServicosComponent;
  let fixture: ComponentFixture<RegistrarServicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarServicosComponent]
    });
    fixture = TestBed.createComponent(RegistrarServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

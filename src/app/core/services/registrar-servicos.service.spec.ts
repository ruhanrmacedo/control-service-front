import { TestBed } from '@angular/core/testing';
import { RegistrarServicosService } from './registrar-servicos.service';

describe('RegistrarServicosService', () => {
  let service: RegistrarServicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarServicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

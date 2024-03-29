import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RegistrarServicosService } from 'src/app/core/services/registrar-servicos.service';
import { ServicoService } from 'src/app/core/services/servico.service';
import { TecnicoService } from 'src/app/core/services/tecnico.service';
import { RegistroServicoDTO, Servico, Tecnico } from 'src/app/core/types/type';

@Component({
  selector: 'app-registrar-servicos',
  templateUrl: './registrar-servicos.component.html',
  styleUrls: ['./registrar-servicos.component.scss']
})
export class RegistrarServicosComponent implements OnInit {
  registroForm: FormGroup;
  tecnicosFiltrados: Observable<Tecnico[]> | undefined;
  servicosFiltrados: Observable<Servico[]> | undefined;
  tecnicos: Tecnico[] = []; // Sua lista de técnicos
  servicos: Servico[] = []; // Sua lista de serviços
  tecnicoControl = new FormControl(); // Adicionado o FormControl
  servicoControl = new FormControl();
  servicosExecutadosDataSource = new MatTableDataSource<RegistroServicoDTO>([]);
  displayedColumns: string[] = ['id', 'contrato', 'os', 'data', 'nomeTecnico', 'descricaoServico', 'valorClaro', 'valorMacedo'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private fb: FormBuilder,
    private registrarServicosService: RegistrarServicosService,
    private tecnicoService: TecnicoService,
    private servicoService: ServicoService
  ) {
    this.registroForm = this.fb.group({
      contrato: ['', [Validators.required]], // Use array de validadores
      os: ['', [Validators.required]],
      data: ['', [Validators.required]],
      idTecnico: [null, [Validators.required]], // IDs geralmente são números, então você pode inicializar como null
      idServico: [null, [Validators.required]],
      valorClaro: [''],
      valorMacedo: ['']
    });
  }

  ngOnInit(): void {
    this.carregarServicosExecutados();
    this.loadTecnicos();
    this.loadServicos();

    this.tecnicoService.listarTecnicos(0, 20).subscribe(tecnicos => {
      this.tecnicos = tecnicos.content; // Supondo que a resposta tenha um campo 'content'
    });
    this.servicoService.listarServicos(0, 20).subscribe(servicos => {
      this.servicos = servicos.content; // Supondo que a resposta tenha um campo 'content'
    });

    this.setupAutocompleteFilters();
  }

  registrar(): void {
    if (this.registroForm.valid) {
      const registro: RegistroServicoDTO = this.registroForm.value;
      // Chamada ao serviço para registrar
      this.registrarServicosService.registrarServico(registro).subscribe(
        success => {
          console.log('Serviço registrado com sucesso');
          // Aqui você pode fazer o que for necessário após o registro, como resetar o formulário
          this.registroForm.reset();
        },
        error => {
          console.error('Ocorreu um erro:', error);
        }
      );
    } else {
      console.error('Formulário inválido');
    }
  }

  get isRootOrGerente(): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuarioLogado');
    return tipoUsuario === 'ROOT' || tipoUsuario === 'GERENTE';
  }

  private loadTecnicos() {
    // Altere o número de página e tamanho conforme necessário
    this.tecnicoService.listarTecnicos(0, 1000).subscribe({
      next: (response) => {
        // Atualize aqui com a propriedade correta da sua resposta, se for diferente
        this.tecnicos = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar técnicos', error);
      }
    });
  }

  private loadServicos() {
    // Altere o número de página e tamanho conforme necessário
    this.servicoService.listarServicos(0, 1000).subscribe({
      next: (response) => {
        // Atualize aqui com a propriedade correta da sua resposta, se for diferente
        this.servicos = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços', error);
      }
    });
  }

  private setupAutocompleteFilters() {
    this.tecnicosFiltrados = this.tecnicoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterTecnicos(value))
      );
    this.servicosFiltrados = this.servicoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterServicos(value))
      );
  
    // Adicionar um observável similar para os serviços
  }

  private filterTecnicos(value: string): Tecnico[] {
    const filterValue = value.toLowerCase();
    return this.tecnicos.filter(tecnico => tecnico.nome.toLowerCase().includes(filterValue));
  }

  private filterServicos(value: string): Servico[] {
    const filterValue = value.toLowerCase();
    return this.servicos.filter(servicos => servicos.descricao.toLowerCase().includes(filterValue));
  }

  carregarServicosExecutados(): void {
    this.registrarServicosService.listarServicosExecutados(0, 20).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos: ', data);
        this.servicosExecutadosDataSource = new MatTableDataSource<RegistroServicoDTO>(data.content);
        this.servicosExecutadosDataSource.paginator = this.paginator;
        console.log('Dados após atribuição: ', this.servicosExecutadosDataSource.data);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.error('Error ao carregar dados', err)
    });
  }

  onServicoSelected(idServico: number): void {
    this.servicoService.buscarServicoPorId(idServico).subscribe(servico => {
      this.registroForm.patchValue({
        valorClaro: servico.valorClaro,
        valorMacedo: servico.valorMacedo
      });
    });
  }



}

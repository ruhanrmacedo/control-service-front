import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegistrarServicosService } from 'src/app/core/services/registrar-servicos.service';
import { ServicoService } from 'src/app/core/services/servico.service';
import { TecnicoService } from 'src/app/core/services/tecnico.service';
import { listarServicosExecutadosAdmDTO, RegistroServicoDTO, Servico, ServicoGerente, Tecnico } from 'src/app/core/types/type';

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
  servicosExecutadosAdmDataSource = new MatTableDataSource<listarServicosExecutadosAdmDTO>([]);
  displayedColumns: string[] = ['id', 'contrato', 'os', 'data', 'nomeTecnico', 'descricaoServico', 'valorClaro', 'valorMacedo'];
  displayedColumnsAdm: string[] = ['id', 'contrato', 'os', 'data', 'nomeTecnico', 'descricaoServico'];
  servicoSelecionado: any = null;
  quantidadeServicos: number | null = null;
  valorTotalClaro: number | null = null;
  valorTotalMacedos: number | null = null;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isUserGerenteOuRoot: any;

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private fb: FormBuilder,
    private registrarServicosService: RegistrarServicosService,
    private tecnicoService: TecnicoService,
    private servicoService: ServicoService,
    private authService: AuthService
  ) {
    this.isUserGerenteOuRoot = this.authService.isGerenteOuRoot();
    this.registroForm = this.fb.group({
      contrato: ['', Validators.required],
      os: ['', Validators.required],
      data: ['', Validators.required],
      idTecnico: [''], // Ajustado para ser parte do FormGroup
      idServico: [''], // Ajustado para ser parte do FormGroup
      valorClaro: [''],
      valorMacedo: ['']
    });
  }

  ngOnInit(): void {
    this.carregarServicosExecutados();
    this.carregarServicosExecutadosAdm();
    this.loadTecnicos();
    this.loadServicos();
    this.tecnicoService.listarTecnicos(0, 1000).subscribe(tecnicos => {
      this.tecnicos = tecnicos.content; // Supondo que a resposta tenha um campo 'content'
    });
    if (this.isUserGerenteOuRoot) {
      this.servicoService.listarServicosGerente(0, 1000).subscribe(servicos => {
        this.servicos = servicos.content; // Supondo que a resposta tenha um campo 'content'
      });
    } else {
      this.servicoService.listarServicos(0, 1000).subscribe(servicos => {
        this.servicos = servicos.content; // Supondo que a resposta tenha um campo 'content'
      });
    }
    this.setupAutocompleteFilters();
  }

  registrar(): void {
    if (this.registroForm.valid) {
      const formValue = this.registroForm.value;
      const registro: RegistroServicoDTO = {
        contrato: formValue.contrato,
        os: formValue.os,
        data: formValue.data,
        idTecnico: formValue.idTecnico,
        idServico: formValue.idServico,
        valorClaro: formValue.valorClaro,
        valorMacedo: formValue.valorMacedo
      };

      this.registrarServicosService.registrarServico(registro).subscribe({
        next: (success) => {
          console.log('Serviço registrado com sucesso');

          // Extrai o mês e o ano da data do serviço registrado
          const data = new Date(registro.data);
          const mes = data.getMonth() + 1; // getMonth() retorna mês de 0 a 11
          const ano = data.getFullYear();

          // Atualiza a tabela com os serviços do mês do serviço registrado
          this.atualizarListaServicos(mes, ano);
          this.obterResumoMensal(mes, ano);

          this.registroForm.reset();
        },
        error: (error) => {
          console.error('Ocorreu um erro:', error);
        }
      });
    } else {
      console.error('Formulário inválido');
    }
  }

  atualizarListaServicos(mes: number, ano: number): void {
    this.registrarServicosService.listarServicosPorMesEAno(mes, ano).subscribe({
      next: (servicos) => {
        this.servicosExecutadosDataSource = new MatTableDataSource<RegistroServicoDTO>(servicos);
        this.servicosExecutadosDataSource.paginator = this.paginator;
        this.changeDetectorRefs.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar serviços executados', err)
    });
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
    this.servicoService.listarServicosGerente(0, 1000).subscribe({
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
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this.filterTecnicos(nome) : this.tecnicos.slice())
      );

    this.servicosFiltrados = this.servicoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.descricao),
        map(descricao => descricao ? this.filterServicos(descricao) : this.servicos.slice())
      );
  }

  private filterTecnicos(value: any): Tecnico[] {
    if (!value) return this.tecnicos; // Se o valor for null ou undefined, retorna todos os técnicos
    let filterValue = value instanceof Object ? value.nome : value.toString();
    return this.tecnicos.filter(tecnico => tecnico.nome.toLowerCase().includes(filterValue.toLowerCase()));
  }

  private filterServicos(value: any): Servico[] {
    if (!value) return this.servicos; // Se o valor for null ou undefined, retorna todos os serviços
    let filterValue = value instanceof Object ? value.descricao : value.toString();
    return this.servicos.filter(servico => servico.descricao.toLowerCase().includes(filterValue.toLowerCase()));
  }

  carregarServicosExecutados(): void {
    this.registrarServicosService.listarServicosExecutados(0, 20).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos: ', data);
        this.servicosExecutadosDataSource = new MatTableDataSource<RegistroServicoDTO>(data.content);
        this.servicosExecutadosDataSource.paginator = this.paginator;
        console.log('Dados após atribuição: ', this.servicosExecutadosDataSource.data);
        this.changeDetectorRefs.detectChanges();
      },
      error: (err) => console.error('Error ao carregar dados', err)
    });
  }

  carregarServicosExecutadosAdm(): void {
    this.registrarServicosService.listarServicosExecutadosAdm(0, 20).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos: ', data);
        this.servicosExecutadosAdmDataSource = new MatTableDataSource<listarServicosExecutadosAdmDTO>(data.content);
        this.servicosExecutadosAdmDataSource.paginator = this.paginator;
        console.log('Dados após atribuição: ', this.servicosExecutadosAdmDataSource.data);
        this.changeDetectorRefs.detectChanges();
      },
      error: (err) => console.error('Error ao carregar dados', err)
    });
  }

  onServicoSelected(event: MatAutocompleteSelectedEvent): void {
    const servico: ServicoGerente = event.option.value;
    console.log('Serviço selecionado:', servico);
    this.servicoControl.setValue(servico);
    this.registroForm.patchValue({
      idServico: servico.idServico, // Assegure-se que seu objeto ServicoGerente tem essa propriedade.
      valorClaro: servico.valorClaro, // Isso preencherá o valorClaro automaticamente.
      valorMacedo: servico.valorMacedo // Isso preencherá o valorMacedo automaticamente.
    });
    this.changeDetectorRefs.detectChanges();
  }

  onTecnicoSelected(event: MatAutocompleteSelectedEvent): void {
    const tecnico: Tecnico = event.option.value;
    this.tecnicoControl.setValue(tecnico);
    this.registroForm.patchValue({
      idTecnico: tecnico.idTecnico // Assegure-se que seu objeto Tecnico tem essa propriedade.
    });
  }

  displayFnTecnico(tecnico?: Tecnico): string {
    return tecnico ? tecnico.nome : '';
  }

  displayFnServico(servico?: Servico): string {
    return servico ? servico.descricao : '';
  }

  selecionarServico(servico: any): void {
    this.servicoSelecionado = servico;
    console.log("Serviço selecionado:", this.servicoSelecionado);
  }

  editarServico(): void {

  }

  excluirServico(): void {
    if (this.servicoSelecionado) {
      if (confirm(`Confirma a exclusão do contrato ${this.servicoSelecionado.contrato}?`)) {
        this.registrarServicosService.excluirServicoExecutado(this.servicoSelecionado.id).subscribe({
          next: () => {
            alert('Contrato excluído com sucesso.');

            this.carregarServicosExecutados();
          },
          error: (err) => {
            console.error('Erro ao excluir o contrato', err);
          }
        });
      }
    } else {
      alert('Por favor, selecione um contrato para excluir.');
    }

  }

  obterResumoMensal(mes: number, ano: number): void {
    this.registrarServicosService.obterResumoMensal(mes, ano).subscribe({
      next: (resumo) => {
        this.quantidadeServicos = resumo.quantidadeServicos;
        this.valorTotalClaro = resumo.valorTotalClaro;
        this.valorTotalMacedos = resumo.valorTotalMacedos;
        this.changeDetectorRefs.detectChanges();
      },
      error: (err) => console.error('Erro ao obter o resumo mensal', err)
    });
  }
}


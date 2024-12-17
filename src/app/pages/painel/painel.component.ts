import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { ComissaoService } from 'src/app/core/services/comissao.service';
import { TecnicoService } from 'src/app/core/services/tecnico.service';
import { ContratoExecutadoDTO, ContratoExecutadoImpressao, Tecnico } from 'src/app/core/types/type';
import { ModalComissaoComponent } from 'src/app/shared/modal/painel/modal-comissao/modal-comissao.component';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  registroForm: FormGroup;
  tecnicosFiltrados: Observable<Tecnico[]> | undefined;
  contratosExecutadosDataSource = new MatTableDataSource<ContratoExecutadoDTO>([]);
  contratosExecutadosImpressaoDataSource = new MatTableDataSource<ContratoExecutadoImpressao>([]);
  displayedColumns: string[] = ['id', 'contrato', 'os', 'data', 'nomeTecnico', 'descricaoServico', 'valor1', 'valorTotal', 'comissao'];
  displayedColumnsImpressao: string[] = ['contrato', 'os', 'data', 'descricaoServico', 'comissao'];
  tecnicoControl = new FormControl();
  tecnicos: Tecnico[] = [];
  anos: number[] = [];
  somaValorTotal: number = 0;
  valorTotal1: number = 0;
  comissaoTotal: number = 0;
  isPrinting = false;
  nomeTecnico: string = '';
  contratosPorTecnico: any[] = [];
  isAdmin = false;

  // Configurações para o gráfico
  evolucaoValores: any[] = [];
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Ano';
  showYAxisLabel = true;
  yAxisLabel = 'Valor';

  constructor(
    private fb: FormBuilder,
    private tecnicoService: TecnicoService,
    private comissaoService: ComissaoService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.registroForm = this.fb.group({
      idTecnico: [''],
      mes: [''],
      ano: [''],
      bonus: [false]
    })
    const anoAtual = new Date().getFullYear();
    for (let i = 0; i < 6; i++) {
      this.anos.push(anoAtual - i);
    }
  }

  ngOnInit(): void {
    this.loadTecnicos();
    this.tecnicoService.listarTecnicos(0, 1000).subscribe(tecnicos => {
      this.tecnicos = tecnicos.content;
    });
    this.setupAutoCompleteFilters();
    this.evolucaoValores = [];
    this.isAdmin = this.authService.isGerenteOuRoot();
  }

  onSubmit(): void {
    const formValue = this.registroForm.value;
    const requestValue = {
      tecnicoId: formValue.idTecnico,
      mes: formValue.mes,
      ano: formValue.ano,
      bonus: formValue.bonus
    };

    this.comissaoService.getContratosExecutados(
      requestValue.tecnicoId,
      requestValue.mes,
      requestValue.ano,
      requestValue.bonus
    ).subscribe(
      data => {
        // Processar os dados recebidos
        this.contratosExecutadosDataSource.data = data;
      },
      error => {
        // Tratar o erro
        console.error('Erro ao buscar contratos executados:', error);
      }
    );

    this.comissaoService.getValoresExecutados(
      formValue.idTecnico, formValue.mes, formValue.ano
    ).subscribe(valores => {
      this.somaValorTotal = valores.valorTotal;
      this.valorTotal1 = valores.valor1Total;
    });

    this.comissaoService.calcularComissao(
      formValue.idTecnico, formValue.mes, formValue.ano, formValue.bonus
    ).subscribe(comissao => {
      this.comissaoTotal = comissao;
    });

    if (this.isAdmin) {
      // Buscar e processar dados para o gráfico de contratos por técnico
      this.comissaoService.getContratosPorTecnico(requestValue.tecnicoId, requestValue.mes, requestValue.ano).subscribe(
        data => {
          this.contratosPorTecnico = [
            {
              name: 'Contratos',
              series: data.map(item => ({
                name: item.tecnicoNome,
                value: item.contratosCount
              }))
            }
          ];
        },
        error => {
          console.error('Erro ao buscar contratos por técnico:', error);
        }
      );
    }

    // Buscar e processar dados de evolução para o gráfico
    this.comissaoService.getEvolucaoValor(requestValue.tecnicoId).subscribe(
      data => {
        console.log('Dados brutos recebidos:', data);
        this.evolucaoValores = [
          {
            name: 'Evolução',
            series: data.map(item => ({
              name: this.getFormattedDate(item[0], item[1]), 
              value: item[2]
            }))
          }
        ];
        console.log('Dados mapeados para o gráfico:', this.evolucaoValores);
      },
      error => {
        console.error('Erro ao buscar evolução dos valores:', error);
      }
    );
  }

  getFormattedDate(month: number, year: number): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[month - 1]}/${year}`;
  }

  private loadTecnicos() {
    // Altere o número de página e tamanho conforme necessário
    this.tecnicoService.listarTecnicos(0, 1000).subscribe({
      next: (response) => {
        this.tecnicos = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar técnicos', error);
      }
    });
  }

  private setupAutoCompleteFilters() {
    this.tecnicosFiltrados = this.tecnicoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this.filterTecnicos(nome) : this.tecnicos.slice())
      );
  }

  private filterTecnicos(value: any): Tecnico[] {
    if (!value) return this.tecnicos; // Se o valor for null ou undefined, retorna todos os técnicos
    let filterValue = value instanceof Object ? value.nome : value.toString();
    return this.tecnicos.filter(tecnico => tecnico.nome.toLowerCase().includes(filterValue.toLowerCase()));
  }

  onTecnicoSelected(event: MatAutocompleteSelectedEvent): void {
    const tecnico: Tecnico = event.option.value;
    this.nomeTecnico = tecnico.nome;
    this.tecnicoControl.setValue(tecnico);
    this.registroForm.patchValue({
      idTecnico: tecnico.idTecnico
    })
  }

  displayFnTecnico(tecnico?: Tecnico): string {
    return tecnico ? tecnico.nome : '';
  }

  get isRootOrGerente(): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuarioLogado');
    return tipoUsuario === 'ROOT' || tipoUsuario === 'GERENTE';
  }

  openPrintModal(): void {
    const dialogRef = this.dialog.open(ModalComissaoComponent, {
      width: '80%', // Exemplo de largura, ajuste como necessário
      data: {
        nomeTecnico: this.nomeTecnico,
        contratosExecutadosDataSource: this.contratosExecutadosDataSource,
        comissaoTotal: this.comissaoTotal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado.');
      // Lógica após fechar o modal
    });
  }
  meses: { nome: string, valor: number }[] = [
    { nome: 'Janeiro', valor: 1 },
    { nome: 'Fevereiro', valor: 2 },
    { nome: 'Março', valor: 3 },
    { nome: 'Abril', valor: 4 },
    { nome: 'Maio', valor: 5 },
    { nome: 'Junho', valor: 6 },
    { nome: 'Julho', valor: 7 },
    { nome: 'Agosto', valor: 8 },
    { nome: 'Setembro', valor: 9 },
    { nome: 'Outubro', valor: 10 },
    { nome: 'Novembro', valor: 11 },
    { nome: 'Dezembro', valor: 12 },
  ];
}

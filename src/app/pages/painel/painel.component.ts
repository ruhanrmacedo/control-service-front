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
  displayedColumns: string[] = ['id', 'contrato', 'os', 'data', 'nomeTecnico', 'descricaoServico', 'valorClaro', 'valorMacedo', 'comissao'];
  displayedColumnsImpressao: string[] = ['contrato', 'os', 'data', 'descricaoServico', 'comissao'];
  tecnicoControl = new FormControl();
  tecnicos: Tecnico[] = [];
  anos: number[] = [];
  valorTotalMacedo: number = 0;
  valorTotalClaro: number = 0;
  comissaoTotal: number = 0;
  isPrinting = false;
  nomeTecnico: string = '';


  constructor(
    private fb: FormBuilder,
    private tecnicoService: TecnicoService,
    private comissaoService: ComissaoService,
    public dialog: MatDialog
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
      this.valorTotalMacedo = valores.valorMacedoTotal;
      this.valorTotalClaro = valores.valorClaroTotal;
    });

    this.comissaoService.calcularComissao(
      formValue.idTecnico, formValue.mes, formValue.ano, formValue.bonus
    ).subscribe(comissao => {
      this.comissaoTotal = comissao;
    });
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

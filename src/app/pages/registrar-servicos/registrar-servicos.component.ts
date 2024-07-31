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
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalEditarServicoExecutadoComponent } from 'src/app/shared/modal/registrar-servico/modal-editar-servico-executado/modal-editar-servico-executado.component';
import { MatDialog } from '@angular/material/dialog';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';

@Component({
  selector: 'app-registrar-servicos',
  templateUrl: './registrar-servicos.component.html',
  styleUrls: ['./registrar-servicos.component.scss']
})
export class RegistrarServicosComponent implements OnInit {
  registroForm: FormGroup;
  tecnicosFiltrados: Observable<Tecnico[]> | undefined;
  servicosFiltrados: Observable<Servico[]> | undefined;
  servicoAdicionalFiltrados: Observable<Servico[]> | undefined;
  tecnicos: Tecnico[] = []; // Lista de técnicos
  servicos: Servico[] = []; // Lista de serviços
  servicosAdicionais: ServicoGerente[] = []; // Lista de serviços adicionais
  tecnicoControl = new FormControl(); // Adicionado o FormControl
  servicoControl = new FormControl();
  servicoAdicionalControl = new FormControl(); // Control para serviços adicionais
  servicosExecutadosDataSource = new MatTableDataSource<RegistroServicoDTO>([]);
  servicosExecutadosAdmDataSource = new MatTableDataSource<listarServicosExecutadosAdmDTO>([]);
  displayedColumns: string[] = ['id', 'contrato', 'os', 'data', 'nomeTecnico', 'descricaoServico', 'descricaoServicosAdicionais', 'valor1', 'valorTotal'];
  displayedColumnsAdm: string[] = ['id', 'contrato', 'os', 'data', 'nomeTecnico', 'descricaoServico', 'descricaoServicosAdicionais'];
  servicoSelecionado: any = null;
  quantidadeServicos: number | null = null;
  valorTotal1: number | null = null;
  somaValorTotal: number | null = null;
  mensagemSucesso: string | null = null;
  isLoading = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isUserGerenteOuRoot: any;

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private fb: FormBuilder,
    private registrarServicosService: RegistrarServicosService,
    private tecnicoService: TecnicoService,
    private servicoService: ServicoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.isUserGerenteOuRoot = this.authService.isGerenteOuRoot();
    this.registroForm = this.fb.group({
      contrato: ['', Validators.required],
      os: ['', Validators.required],
      data: ['', Validators.required],
      idTecnico: [''], // Ajustado para ser parte do FormGroup
      idServico: [''], // Ajustado para ser parte do FormGroup
      servicosAdicionais: [''],
      valor1: [''],
      valorTotal: ['']
    });
  }

  ngOnInit(): void {
    this.servicosExecutadosDataSource.paginator = this.paginator;
    this.loadTecnicos();
    this.loadServicos();
    this.tecnicoService.listarTecnicos(0, 100).subscribe(tecnicos => {
      this.tecnicos = tecnicos.content; 
    });
    if (this.isUserGerenteOuRoot) {
      this.carregarServicosExecutados(0, 200);
      this.servicoService.listarServicosGerente(0, 300).subscribe(servicos => {
        this.servicos = servicos.content; 
      });
    } else {
      this.carregarServicosExecutadosAdm();
      this.servicoService.listarServicos(0, 300).subscribe(servicos => {
        this.servicos = servicos.content; // Supondo que a resposta tenha um campo 'content'
      });
    }
    this.servicosExecutadosDataSource.filterPredicate = (data: any, filter: string) => {
      return data.contrato.toString().toLowerCase().includes(filter);
    };
    this.servicoService.listarServicosAtivos(0, 1000).subscribe({
      next: (response) => {
        this.servicos = response.content; 
        this.setupAutocompleteFilters(); // Chamar o setupAutocompleteFilters após carregar os serviços
      },
      error: (error) => {
        console.error('Erro ao carregar serviços', error);
      }
    });
    
  }

  registrar(): void {
    if (this.registroForm.valid) {
      this.isLoading = true;
      const formValue = this.registroForm.value;
      const registro: RegistroServicoDTO = {
        contrato: formValue.contrato,
        os: formValue.os,
        data: formValue.data,
        idTecnico: formValue.idTecnico,
        idServico: formValue.idServico,
        servicosAdicionais: this.servicosAdicionais.map(s => s.idServico), // Array de IDs de serviços adicionais
        valor1: formValue.valor1,
        valorTotal: formValue.valorTotal
      };
  
      console.log('Registro enviado:', registro); // Adicionado aqui para verificar os dados enviados

      this.registrarServicosService.registrarServico(registro).subscribe({
        next: (success) => {
          console.log('Serviço registrado com sucesso');
          this.isLoading = false;
          this.mensagemSucesso = 'Contrato registrado com sucesso.';
          this.snackBar.open('Contrato registrado com sucesso.', 'Fechar', {
            duration: 3000
          });
          setTimeout(() => this.mensagemSucesso = null, 3000);

  
          // Extrai o mês e o ano da data do serviço registrado
          const data = new Date(registro.data);
          const mes = data.getMonth() + 1; // getMonth() retorna mês de 0 a 11
          const ano = data.getFullYear();
  
          // Verificar o tipo de usuário e chamar o método correto
          const tipoUsuario = this.authService.getCurrentTipoUsuarioLogado();
          if (tipoUsuario === 'ADMINISTRADOR') {
            this.obterResumoMensalAdmin(mes, ano);
            this.atualizarListaServicosAdm(mes, ano);
          } else {
            // Atualiza a tabela com os serviços do mês do serviço registrado
            this.atualizarListaServicos(mes, ano);
            this.obterResumoMensal(mes, ano);
          }
  
          this.registroForm.reset();
          this.servicosAdicionais = [];
        },
        error: (error) => {
          this.isLoading = false; // Desativa o carregamento
          console.error('Ocorreu um erro:', error);
          this.snackBar.open('Erro ao registrar o contrato: ' + error.message, 'Fechar', {
            duration: 5000
          });
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

  atualizarListaServicosAdm(mes: number, ano: number): void {
    this.registrarServicosService.listarServicosDoAdmPorMesEAno(mes, ano).subscribe({
      next: (servicos) => {
        this.servicosExecutadosAdmDataSource = new MatTableDataSource<listarServicosExecutadosAdmDTO>(servicos);
        this.servicosExecutadosAdmDataSource.paginator = this.paginator;
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
    this.tecnicoService.listarTecnicos(0, 200).subscribe({
      next: (response) => {
        // Atualize aqui com a propriedade correta da sua resposta, se for diferente
        this.tecnicos = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar técnicos', error);
      }
    });
  }

  // Método para carregar os serviços
  private loadServicos() {
    this.servicoService.listarServicosGerente(0, 300).subscribe({
      next: (response) => {
        // Atualize aqui com a propriedade correta da sua resposta, se for diferente
        this.servicos = response.content;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços', error);
      }
    });
  }

  // Método para configurar os filtros de autocomplete
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
        map(descricao => descricao ? this.filterServicos(descricao) : this.servicos.filter(s => s.ativo).slice())
      );

    this.servicoAdicionalFiltrados = this.servicoAdicionalControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descricao),
      map(descricao => descricao ? this.filterServicos(descricao) : this.servicos.filter(s => s.ativo).slice())
    );
  }

  // Método para filtrar os técnicos
  private filterTecnicos(value: any): Tecnico[] {
    if (!value) return this.tecnicos; // Se o valor for null ou undefined, retorna todos os técnicos
    let filterValue = value instanceof Object ? value.nome : value.toString();
    return this.tecnicos.filter(tecnico => tecnico.nome.toLowerCase().includes(filterValue.toLowerCase()));
  }

  // Método para filtrar os serviços
  private filterServicos(value: any): Servico[] {
    if (!value) return this.servicos.filter(s => s.ativo); // Se o valor for null ou undefined, retorna todos os serviços
    let filterValue = value instanceof Object ? value.descricao : value.toString();
    return this.servicos.filter(servico => servico.descricao.toLowerCase().includes(filterValue.toLowerCase()) && servico.ativo);
  }

  // Método para carregar os serviços executados
  carregarServicosExecutados(page: number = 0, size: number = 200): void {
    this.registrarServicosService.listarServicosExecutados(page, size).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos: ', data);

        this.servicosExecutadosDataSource.data = this.servicosExecutadosDataSource.data.concat(data.content);
        this.servicosExecutadosDataSource.paginator = this.paginator;
        this.servicosExecutadosDataSource.paginator.length = data.totalElements;
        console.log('Dados após atribuição: ', this.servicosExecutadosDataSource.data);
        this.changeDetectorRefs.detectChanges();

        // Carregar a próxima página se houver mais dados
        if ((page + 1) * size < data.totalElements) {
          this.carregarServicosExecutados(page + 1, size);
        }
      },
      error: (err) => console.error('Error ao carregar dados', err)
    });
  }

  // Método para carregar os serviços executados para o administrador
  carregarServicosExecutadosAdm(page: number = 0, size: number = 200): void {
    this.registrarServicosService.listarServicosExecutadosAdm(page, size).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos: ', data);

        this.servicosExecutadosAdmDataSource.data = this.servicosExecutadosAdmDataSource.data.concat(data.content);
        this.servicosExecutadosAdmDataSource.paginator = this.paginator;
        this.servicosExecutadosAdmDataSource.paginator.length = data.totalElements;
        console.log('Dados após atribuição: ', this.servicosExecutadosAdmDataSource.data);
        this.changeDetectorRefs.detectChanges();

        if ((page + 1) * size < data.totalElements) {
          this.carregarServicosExecutadosAdm(page + 1, size);
        }
      },
      error: (err) => console.error('Error ao carregar dados', err)
    });
  }

  // Método para o autocomplete de serviços e atualizar os valores do formulário
  onServicoSelected(event: MatAutocompleteSelectedEvent): void {
    const servico: ServicoGerente = event.option.value;
    console.log('Serviço selecionado:', servico);
    this.servicoControl.setValue(servico);
    this.registroForm.patchValue({
      idServico: servico.idServico, // Assegure-se que seu objeto ServicoGerente tem essa propriedade.
      valor1: servico.valor1, // Isso preencherá o valor1 automaticamente.
      valorTotal: this.calculateValorTotal(servico.valor1, this.servicosAdicionais) // Isso preencherá o valorTotal automaticamente.
    });
    this.changeDetectorRefs.detectChanges();
  }

  // Método para calcular o valor total do serviço
  private calculateValorTotal(valorPrincipal: number, servicosAdicionais: ServicoGerente[]): number {
    const valorTotalAdicionais = servicosAdicionais.reduce((total, servico) => total + servico.valor1, 0);
    return valorPrincipal + valorTotalAdicionais;
  }

  // Método para adicionar um serviço adicional
  onServicoAdicionalSelected(event: MatAutocompleteSelectedEvent): void {
    const servico: ServicoGerente = event.option.value;
    this.servicosAdicionais.push(servico);
    this.servicoAdicionalControl.setValue('');
    this.registroForm.patchValue({
      valorTotal: this.calculateValorTotal(this.registroForm.value.valor1, this.servicosAdicionais)
    });
    this.changeDetectorRefs.detectChanges();
  }

  // Método para remover um serviço adicional
  removeServicoAdicional(servico: ServicoGerente): void {
    this.servicosAdicionais = this.servicosAdicionais.filter(s => s.idServico !== servico.idServico);
    this.registroForm.patchValue({
      valorTotal: this.calculateValorTotal(this.registroForm.value.valor1, this.servicosAdicionais)
    }); 
    this.changeDetectorRefs.detectChanges();
  }

  // Método para obter o valor total dos serviços adicionais
  onTecnicoSelected(event: MatAutocompleteSelectedEvent): void {
    const tecnico: Tecnico = event.option.value;
    this.tecnicoControl.setValue(tecnico);
    this.registroForm.patchValue({
      idTecnico: tecnico.idTecnico 
    });
  }

  displayFnTecnico(tecnico?: Tecnico): string {
    return tecnico ? tecnico.nome : '';
  }

  displayFnServico(servico?: Servico): string {
    return servico ? servico.descricao : '';
  }

  displayFnServicosAdicionais(servico?: Servico): string {
    return servico ? servico.descricao : '';
  }

  selecionarServico(servico: any): void {
    this.servicoSelecionado = servico;
    console.log("Serviço selecionado:", this.servicoSelecionado);
  }

  editarServicoRegistrado(): void {
    if (this.servicoSelecionado) {
      const dialogRef = this.dialog.open(ModalEditarServicoExecutadoComponent, {
        data: {
          id: this.servicoSelecionado.id,
          contrato: this.servicoSelecionado.contrato,
          os: this.servicoSelecionado.os,
          data: this.servicoSelecionado.data,
          idTecnico: this.servicoSelecionado.idTecnico,
          idServico: this.servicoSelecionado.idServico,
          servicosAdicionais: this.servicoSelecionado.servicosAdicionais,
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('O modal foi fechado.');
        // Lógica após fechar o modal
      });
    }
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
        this.valorTotal1 = resumo.valorTotal1;
        this.somaValorTotal = resumo.somaValorTotal;
        this.changeDetectorRefs.detectChanges();
      },
      error: (err) => console.error('Erro ao obter o resumo mensal', err)
    });
  }

  obterResumoMensalAdmin(mes: number, ano: number): void {
    this.registrarServicosService.calcularResumoMensalAdm(mes, ano).subscribe({
      next: (resumo) => {
        // Atualize a tabela ou os dados que você deseja exibir com 'resumo'
        // Por exemplo:
        this.quantidadeServicos = resumo.quantidadeServicos;
        // ...
        this.changeDetectorRefs.detectChanges();
      },
      error: (err) => console.error('Erro ao obter o resumo mensal', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.servicosExecutadosDataSource.filter = filterValue.trim().toLowerCase();

    if (this.servicosExecutadosDataSource.paginator) {
      this.servicosExecutadosDataSource.paginator.firstPage();
    }
  }

  applyFilterAdm(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.servicosExecutadosAdmDataSource.filter = filterValue.trim().toLowerCase();

    if (this.servicosExecutadosAdmDataSource.paginator) {
      this.servicosExecutadosAdmDataSource.paginator.firstPage();
    }
  }
}


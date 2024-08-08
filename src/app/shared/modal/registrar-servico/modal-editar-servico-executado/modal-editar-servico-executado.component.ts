import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegistrarServicosService } from 'src/app/core/services/registrar-servicos.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TecnicoService } from 'src/app/core/services/tecnico.service';
import { ServicoService } from 'src/app/core/services/servico.service';
import { Tecnico, Servico } from 'src/app/core/types/type';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal-editar-servico-executado',
  templateUrl: './modal-editar-servico-executado.component.html',
  styleUrls: ['./modal-editar-servico-executado.component.scss']
})
// Componente para o modal de edição de serviço executado 
export class ModalEditarServicoExecutadoComponent implements OnInit {
  editadoComSucesso: boolean = false; // Variável para controlar a exibição da mensagem de sucesso
  erroEditar: boolean = false; // Variável para controlar a exibição da mensagem de erro
  mensagemErro: string = ''; // Variável para armazenar a mensagem de erro
  tecnicosFiltrados: Observable<Tecnico[]> | undefined; // Variável para armazenar os técnicos filtrados
  servicosFiltrados: Observable<Servico[]> | undefined; // Variável para armazenar os serviços filtrados
  servicosAdicionaisFiltrados: Observable<Servico[]> | undefined; // Variável para armazenar os serviços adicionais filtrados
  tecnicoControl = new FormControl(); // Controle do campo de técnico no formulário
  servicoControl = new FormControl(); // Controle do campo de serviço no formulário
  servicoAdicionalControl = new FormControl(); // Controle do campo de serviço adicional no formulário
  tecnicos: Tecnico[] = []; // Array para armazenar os técnicos carregados
  servicos: Servico[] = []; // Array para armazenar os serviços carregados
  servicosAdicionais: Servico[] = []; // Array para armazenar os serviços adicionais selecionados

  // Injeção de dependência dos serviços necessários
  constructor(
    private dialogRef: MatDialogRef<ModalEditarServicoExecutadoComponent>, // Injeção de dependência para o serviço de dialog
    private registrarServicosService: RegistrarServicosService, // Injeção de dependência para o serviço de registrar serviços
    @Inject(MAT_DIALOG_DATA) public data: any, // Injeção de dependência para os dados recebidos no modal (serviço executado)
    private cdr: ChangeDetectorRef, // Injeção de dependência para o detector de mudanças
    private tecnicoService: TecnicoService, // Injeção de dependência para o serviço
    private servicoService: ServicoService, // Injeção de dependência para o serviço
    private fb: FormBuilder, // Injeção de dependência para o form builder
    private datePipe: DatePipe // Injeção de dependência para o date pipe (formatação de datas)
  ) { }

  // Método de inicialização do componente
  ngOnInit(): void {
    this.loadTecnicos(); // Carrega os técnicos disponíveis
    this.loadServicos(); // Carrega os serviços disponíveis
    console.log('Data inicial recebida:', this.data); // Exibe os dados recebidos no modal para debug
    this.tecnicoControl.setValue(this.data.tecnico); // Define o valor inicial do campo de técnico
    this.servicoControl.setValue(this.data.servico); // Define o valor inicial do campo de serviço
    this.servicoAdicionalControl.setValue(this.data.servicosAdicionais); // Define o valor inicial do campo de serviços adicionais
    this.setupAutocompleteFilters(); // Configura os filtros dos campos de autocomplete para técnicos e serviços
  }

  // Método para carregar os técnicos disponíveis
  private loadTecnicos() {
    // Chama o serviço de listar técnicos com os parâmetros de paginação
    this.tecnicoService.listarTecnicos(0, 1000).subscribe({
      next: (response) => {
        // Atribui os técnicos carregados à variável de técnicos
        this.tecnicos = response.content;
        console.log('Técnicos carregados:', this.tecnicos);
      },
      error: (error) => {
        console.error('Erro ao carregar técnicos', error);
      }
    });
  }

  // Método para carregar os serviços disponíveis 
  private loadServicos() {
    // Chama o serviço de listar serviços ativos com os parâmetros de paginação
    this.servicoService.listarServicosAtivos(0, 1000).subscribe({
      next: (response) => {
        // Atribui os serviços carregados à variável de serviços
        this.servicos = response.content;
        console.log('Serviços carregados:', this.servicos);
      },
      error: (error) => {
        console.error('Erro ao carregar serviços', error);
      }
    });
  }

  // Método para configurar os filtros dos campos de autocomplete
  private setupAutocompleteFilters() {
    // Configura o filtro para os técnicos
    this.tecnicosFiltrados = this.tecnicoControl.valueChanges
      .pipe(
        startWith(''),
        // Mapeia o valor do campo de técnico para o nome do técnico
        map(value => {
          console.log('Valor do controle de técnico:', value);
          return typeof value === 'string' ? value : value.nome;
        }),
        // Mapeia o nome do técnico para os técnicos cujo nome contém o valor filtrado
        map(nome => nome ? this.filterTecnicos(nome) : this.tecnicos.slice())
      );

    // Configura o filtro para os serviços
    this.servicosFiltrados = this.servicoControl.valueChanges
      .pipe(
        startWith(''),
        // Mapeia o valor do campo de serviço para a descrição do serviço
        map(value => {
          console.log('Valor do controle de serviço:', value);
          // Se o valor for uma string, retorna o valor, senão, retorna a descrição do serviço
          return typeof value === 'string' ? value : value.descricao;
        }),
        // Mapeia a descrição do serviço para os serviços cuja descrição contém o valor filtrado
        map(descricao => descricao ? this.filterServicos(descricao) : this.servicos.slice())
  
      );

    // Configura o filtro para os serviços adicionais
    this.servicosAdicionaisFiltrados = this.servicoAdicionalControl.valueChanges
      .pipe(
        startWith(''),
        // Mapeia o valor do campo de serviço adicional para a descrição do serviço adicional
        map(value => {
          console.log('Valor do controle de serviço adicional:', value);
          return typeof value === 'string' ? value : value.descricao;
        }),
        // Mapeia a descrição do serviço adicional para os serviços adicionais cuja descrição contém o valor filtrado
        map(descricao => descricao ? this.filterServicos(descricao) : this.servicos.slice())
    );
  }

  // Método para filtrar os técnicos disponíveis
  private filterTecnicos(value: string): Tecnico[] {
    // Converte o valor para minúsculas
    const filterValue = value.toLowerCase();
    // Retorna os técnicos cujo nome contém o valor filtrado
    return this.tecnicos.filter(tecnico => tecnico.nome.toLowerCase().includes(filterValue));
  }

  // Método para filtrar os serviços disponíveis
  private filterServicos(value: string): Servico[] {
    const filterValue = value.toLowerCase();
    return this.servicos.filter(servico => servico.descricao.toLowerCase().includes(filterValue));
  }

  // Método para salvar as alterações feitas no editar serviço executado
  salvarAlteracoes(): void {
    // Formata a data para o formato yyyy-MM-dd
    const dataFormatada = this.datePipe.transform(this.data.data, 'yyyy-MM-dd');
    let servicosAdicionaisAtualizados = this.servicosAdicionais.map((s: Servico) => s.idServico);

    // Se não houver serviços adicionais selecionados, mantém os serviços adicionais atuais
    if (servicosAdicionaisAtualizados.length === 0 && this.data.servicosAdicionais) {
      servicosAdicionaisAtualizados = this.data.servicosAdicionais.map((s: Servico) => s.idServico);
    }

    /* Cria um objeto com os dados atualizados do serviço executado,
    com os campos de id, contrato, os, data, idTecnico, idServico e servicosAd
    icionais */
    const dadosAtualizados = {
      id: this.data.id, 
      contrato: this.data.contrato,
      os: this.data.os,
      data: dataFormatada,
      idTecnico: this.tecnicoControl.value ? this.tecnicoControl.value.idTecnico : this.data.idTecnico,
      idServico: this.servicoControl.value ? this.servicoControl.value.idServico : this.data.idServico,
      servicosAdicionais: servicosAdicionaisAtualizados,
    };

    console.log('Dados a serem atualizados', dadosAtualizados);

    // Chama o serviço de editar serviço executado com os dados atualizados
    this.registrarServicosService.editarServicoExecutado(dadosAtualizados)
      .subscribe({
        next: (res) => {
          this.editadoComSucesso = true; // Exibe a mensagem de sucesso
          alert('Serviço executado atualizado com sucesso');
          this.dialogRef.close(true);
        },
        error: (erro) => {
          this.erroEditar = true; // Exibe a mensagem de erro
          this.mensagemErro = 'Erro ao atualizar serviço executado';
          console.error('Erro ao atualizar', erro);
        }
      });
  }

  removerServicoAdicional(servico: Servico): void { 
    this.servicosAdicionais = this.servicosAdicionais.filter(s => s.idServico !== servico.idServico);
    // Atualiza a lista de serviços adicionais do serviço executado
    this.data.servicosAdicionais = this.data.servicosAdicionais.filter((s: Servico) => s.idServico !== servico.idServico);
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  fecharModalErro(): void {
    this.erroEditar = false;
    this.mensagemErro = '';
  }

  // Método para exibir o nome do técnico no campo de técnico
  displayFnTecnico(tecnico?: Tecnico): string {
    return tecnico ? tecnico.nome : '';
  }

  // Método para exibir a descrição do serviço no campo de serviço
  displayFnServico(servico?: Servico): string {
    return servico ? servico.descricao : '';
  }

  // Método para exibir a descrição do serviço adicional no campo de serviço adicional
  onTecnicoSelected(event: MatAutocompleteSelectedEvent): void {
    const tecnico: Tecnico = event.option.value;
    this.tecnicoControl.setValue(tecnico);
    this.data.idTecnico = tecnico.idTecnico;
  }

  // Método para exibir a descrição do serviço no campo de serviço
  onServicoSelected(event: MatAutocompleteSelectedEvent): void {
    const servico: Servico = event.option.value;
    this.servicoControl.setValue(servico);
    this.data.idServico = servico.idServico;
  }

  // Método para exibir a descrição do serviço adicional no campo de serviço adicional
  onServicoAdicionalSelected(event: MatAutocompleteSelectedEvent): void {
    const servico: Servico = event.option.value;
    if (!this.servicosAdicionais.includes(servico)) {
      this.servicosAdicionais.push(servico);
    }
    this.servicoAdicionalControl.setValue('');
  }

  // Método para remover um serviço adicional da lista de serviços adicionais
  removeServicoAdicional(servico: Servico): void {
    this.servicosAdicionais = this.servicosAdicionais.filter(s => s.idServico !== servico.idServico);
  }
}

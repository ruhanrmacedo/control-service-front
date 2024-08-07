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

@Component({
  selector: 'app-modal-editar-servico-executado',
  templateUrl: './modal-editar-servico-executado.component.html',
  styleUrls: ['./modal-editar-servico-executado.component.scss']
})
export class ModalEditarServicoExecutadoComponent implements OnInit {

  editadoComSucesso: boolean = false;
  erroEditar: boolean = false;
  mensagemErro: string = '';
  tecnicosFiltrados: Observable<Tecnico[]> | undefined;
  servicosFiltrados: Observable<Servico[]> | undefined;
  servicosAdicionaisFiltrados: Observable<Servico[]> | undefined;
  tecnicoControl = new FormControl();
  servicoControl = new FormControl();
  servicoAdicionalControl = new FormControl();
  tecnicos: Tecnico[] = [];
  servicos: Servico[] = [];
  servicosAdicionais: Servico[] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalEditarServicoExecutadoComponent>,
    private registrarServicosService: RegistrarServicosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private tecnicoService: TecnicoService,
    private servicoService: ServicoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadTecnicos();
    this.loadServicos();
    console.log('Data inicial recebida:', this.data);
    this.tecnicoControl.setValue(this.data.tecnico);
    this.servicoControl.setValue(this.data.servico);
    this.servicoAdicionalControl.setValue(this.data.servicosAdicionais);
    this.setupAutocompleteFilters();
  }

  private loadTecnicos() {
    this.tecnicoService.listarTecnicos(0, 1000).subscribe({
      next: (response) => {
        this.tecnicos = response.content;
        console.log('Técnicos carregados:', this.tecnicos);
      },
      error: (error) => {
        console.error('Erro ao carregar técnicos', error);
      }
    });
  }

  private loadServicos() {
    this.servicoService.listarServicosAtivos(0, 1000).subscribe({
      next: (response) => {
        this.servicos = response.content;
        console.log('Serviços carregados:', this.servicos);
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
        map(value => {
          console.log('Valor do controle de técnico:', value);
          return typeof value === 'string' ? value : value.nome;
        }),
        map(nome => nome ? this.filterTecnicos(nome) : this.tecnicos.slice())
      );

    this.servicosFiltrados = this.servicoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          console.log('Valor do controle de serviço:', value);
          return typeof value === 'string' ? value : value.descricao;
        }),
        map(descricao => descricao ? this.filterServicos(descricao) : this.servicos.slice())
  
      );

    this.servicosAdicionaisFiltrados = this.servicoAdicionalControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          console.log('Valor do controle de serviço adicional:', value);
          return typeof value === 'string' ? value : value.descricao;
        }),
        map(descricao => descricao ? this.filterServicos(descricao) : this.servicos.slice())
    );
  }

  private filterTecnicos(value: string): Tecnico[] {
    const filterValue = value.toLowerCase();
    return this.tecnicos.filter(tecnico => tecnico.nome.toLowerCase().includes(filterValue));
  }

  private filterServicos(value: string): Servico[] {
    const filterValue = value.toLowerCase();
    return this.servicos.filter(servico => servico.descricao.toLowerCase().includes(filterValue));
  }

  salvarAlteracoes(): void {
    const dadosAtualizados = {
      id: this.data.id, // Inclua o ID no objeto
      contrato: this.data.contrato,
      os: this.data.os,
      data: this.data.data,
      idTecnico: this.tecnicoControl.value ? this.tecnicoControl.value.idTecnico : this.data.idTecnico,
      idServico: this.servicoControl.value ? this.servicoControl.value.idServico : this.data.idServico,
      servicosAdicionais: this.servicosAdicionais.map(s => s.idServico),
    };

    console.log('Dados a serem atualizados', dadosAtualizados);

    this.registrarServicosService.editarServicoExecutado(dadosAtualizados)
      .subscribe({
        next: (res) => {
          this.editadoComSucesso = true;
          alert('Serviço executado atualizado com sucesso');
          this.dialogRef.close(true);
        },
        error: (erro) => {
          this.erroEditar = true;
          this.mensagemErro = 'Erro ao atualizar serviço executado';
          console.error('Erro ao atualizar', erro);
        }
      });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  fecharModalErro(): void {
    this.erroEditar = false;
    this.mensagemErro = '';
  }

  displayFnTecnico(tecnico?: Tecnico): string {
    return tecnico ? tecnico.nome : '';
  }

  displayFnServico(servico?: Servico): string {
    return servico ? servico.descricao : '';
  }

  onTecnicoSelected(event: MatAutocompleteSelectedEvent): void {
    const tecnico: Tecnico = event.option.value;
    this.tecnicoControl.setValue(tecnico);
    this.data.idTecnico = tecnico.idTecnico;
  }

  onServicoSelected(event: MatAutocompleteSelectedEvent): void {
    const servico: Servico = event.option.value;
    this.servicoControl.setValue(servico);
    this.data.idServico = servico.idServico;
  }

  onServicoAdicionalSelected(event: MatAutocompleteSelectedEvent): void {
    const servico: Servico = event.option.value;
    if (!this.servicosAdicionais.includes(servico)) {
      this.servicosAdicionais.push(servico);
    }
    this.servicoAdicionalControl.setValue('');
  }

  removeServicoAdicional(servico: Servico): void {
    this.servicosAdicionais = this.servicosAdicionais.filter(s => s.idServico !== servico.idServico);
  }
}

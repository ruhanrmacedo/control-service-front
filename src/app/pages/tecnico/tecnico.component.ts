import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tecnico, TecnicoGerente } from 'src/app/core/types/type';
import { ChangeDetectorRef } from '@angular/core';
import { TecnicoService } from 'src/app/core/services/tecnico.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalEditarTecnicoComponent } from 'src/app/shared/modal/tecnico/modal-editar-tecnico/modal-editar-tecnico.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tecnico',
  templateUrl: './tecnico.component.html',
  styleUrls: ['./tecnico.component.scss']
})
export class TecnicoComponent {
  tecnicoForm: FormGroup;
  displayedColumns: string[] = ['idTecnico', 'nome', 'login', 'placa', 'dataAdmissao'];
  tecnicoGerente: TecnicoGerente[] = [];
  displayedColumnsGerente: string[] = ['idTecnico', 'nome', 'cpf', 'login', 'placa', 'dataAdmissao', 'dataDesligamento'];
  isUserGerenteOuRoot: boolean = false;
  tecnicoSelecionado: any = null;
  tecnicos: Tecnico[] = [];
  tecnicosDataSource = new MatTableDataSource<Tecnico>([]);
  tecnicoGerenteDataSource = new MatTableDataSource<TecnicoGerente>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private tecnicoService: TecnicoService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.isUserGerenteOuRoot = this.authService.isGerenteOuRoot();
    this.tecnicoForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      login: ['', Validators.required],
      placa: ['', Validators.required],
      dataAdmissao: ['', Validators.required]
      //dataDesligamento: ['', Validators.required]
    });
  }

  carregarTecnicos(): void {
    this.tecnicoService.listarTecnicos(0, 20).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data);
        this.tecnicosDataSource = new MatTableDataSource<Tecnico>(data.content);
        this.tecnicosDataSource.paginator = this.paginator;
        this.paginator.length = data.totalElements;
        console.log('Serviços após atribuição:', this.tecnicosDataSource.data);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar técnicos', err)
    });
  }

  carregarTodosTecnicos(): void {
    if (this.isUserGerenteOuRoot) {
      this.tecnicoService.listarTodosTecnicos(0, 20).subscribe({
        next: (data: any) => {
          console.log("Dados recebidos: ", data);
          this.tecnicoGerenteDataSource = new MatTableDataSource<TecnicoGerente>(data.content);
          this.tecnicoGerenteDataSource.paginator = this.paginator;
          console.log('Técnicos Gerente  após atribuição', this.tecnicoGerenteDataSource.data);
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          if (err.status === 403) {
            this.isUserGerenteOuRoot = false; // Usuário não é GERENTE ou ROOT
          }
          console.error('Erro ao carregar técnicos', err);
          console.log(err); // Adicione isto para ver o erro detalhado
        }
      });
    } else {
      console.log('Usuário não tem permissão para ver esses dados');
    }

  }

  ngOnInit(): void {
    this.carregarTecnicos();
    this.carregarTodosTecnicos();

  }

  onSubmit(): void {
    if (this.tecnicoForm.valid) {
      this.tecnicoService.cadastrarTecnico(this.tecnicoForm.value).subscribe({
        next: (res) => {
          console.log('Técnico cadastrado com sucesso!', res);
          alert('Técnico cadastrado com sucesso!')
          this.tecnicoForm.reset(); // Limpar o formulário após o cadastro
          this.carregarTodosTecnicos(); // Recarrega os técnicos para atualizar a tabela
        },
        error: (err) => {
          console.error('Erro ao cadastrar técnico', err);
          // Implementar tratamento de erro
        }
      });
    }
  }

  selecionarTecnico(tecnico: any): void {
    this.tecnicoSelecionado = tecnico;
    console.log("Técnico selecionado:", this.tecnicoSelecionado);
  }

  editarTecnico(): void {
    if (this.tecnicoSelecionado) {
      const dialogRef = this.dialog.open(ModalEditarTecnicoComponent, {
        data: {
          idTecnico: this.tecnicoSelecionado.idTecnico,
          nome: this.tecnicoSelecionado.nome,
          cpf: this.tecnicoSelecionado.cpf,
          login: this.tecnicoSelecionado.login,
          placa: this.tecnicoSelecionado.placa
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('O modal foi fechado.');
        // Lógica após fechar o modal
      });
    } else {
      console.log("Nenhum técnico selecionado.");
    }
  }

  demitirTecnico(): void {
    if (this.tecnicoSelecionado) {
      const confirmacao = confirm(`Confirma a exclusão do técnico ${this.tecnicoSelecionado.nome}?`);
      if (confirmacao) {
        // Gere a data atual e formate como 'YYYY-MM-DD'
        const dataAtual = new Date().toISOString().slice(0, 10);

        // Passe o ID e a data de inativação para o serviço
        this.tecnicoService.demitirTecnico(this.tecnicoSelecionado.idTecnico, dataAtual).subscribe({
          next: () => {
            alert('Técnico desligado com sucesso.');
            this.carregarTodosTecnicos(); // Recarrega a lista de usuários
          },
          error: (erro) => {
            console.error('Erro ao desligar o técnico', erro);
          }
        });
      }
    } else {
      alert('Por favor, selecione um usuário para excluir.');
    }
  }
}

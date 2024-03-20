import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicoService } from 'src/app/core/services/servico.service';
import { ChangeDetectorRef } from '@angular/core';
import { Servico, ServicoGerente } from 'src/app/core/types/type';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditarServicoComponent } from 'src/app/shared/modal/servico/modal-editar-servico/modal-editar-servico.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss']
})
export class ServicoComponent {
  servicoForm: FormGroup;
  tiposServico: any[] = [];
  servicos: Servico[] = [];
  displayedColumns: string[] = ['idServico', 'descricao', 'tipoServico']; 
  servicosGerente: ServicoGerente[] = [];
  displayedColumnsGerente: string[] = ['idServico', 'descricao', 'valorClaro', 'valorMacedo', 'tipoServico', 'ativo']; 
  isUserGerenteOuRoot: boolean = false;
  servicoSelecionado: any = null;
  servicoGerenteDataSource = new MatTableDataSource<ServicoGerente>([]);
  servicosDataSource = new MatTableDataSource<Servico>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private fb: FormBuilder, 
    private servicoService: ServicoService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.isUserGerenteOuRoot = this.authService.isGerenteOuRoot();
    this.servicoForm = this.fb.group({
      descricao: ['', Validators.required],
      valorClaro: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      valorMacedo: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      tipoServico: ['', Validators.required]
    });

    this.carregarTiposServico();
  }

  carregarTiposServico(): void {
    this.servicoService.getTiposServico().subscribe({
      next: (tipos) => {
        this.tiposServico = tipos;
      },
      error: (err) => console.error('Erro ao carregar tipos de serviço', err)
    });
  }

  carregarServicos(): void {
    this.servicoService.listarServicos(0, 20).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data);
        this.servicosDataSource = new MatTableDataSource<Servico>(data.content);
        this.servicosDataSource.paginator = this.paginator;
        console.log('Serviços após atribuição:', this.servicosDataSource.data);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar serviços', err)
    });
  }

  carregarServicosGerente(): void {
    if (this.isUserGerenteOuRoot) {
      this.servicoService.listarServicosGerente(0, 20).subscribe({
        next: (data: any) => {
          console.log('Dados Serviço Gerente recebidos:', data);
          this.servicoGerenteDataSource = new MatTableDataSource<ServicoGerente>(data.content);
          this.servicoGerenteDataSource.paginator = this.paginator;
          console.log('Serviços Gerente após atribuição:', this.servicoGerenteDataSource.data);
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          if (err.status === 403) {
            this.isUserGerenteOuRoot = false; // Usuário não é GERENTE ou ROOT
          }
          console.error('Erro ao carregar serviços', err);
          console.log(err); // Adicione isto para ver o erro detalhado
        }
      });
    } else {
      console.log('Usuário não tem permissão para ver esses dados');
    }
    
  }

  ngOnInit(): void {
    this.carregarServicos();
    this.carregarServicosGerente();

  }

  onSubmit(): void {
    if (this.servicoForm.valid) {
      this.servicoService.cadastrarServico(this.servicoForm.value).subscribe({
        next: (res) => {
          console.log('Serviço cadastrado com sucesso!', res);
          alert('Serviço cadastrado com sucesso!')
          this.servicoForm.reset(); // Limpar o formulário após o cadastro
          this.carregarServicos(); // Recarrega os serviços para atualizar a tabela
          this.carregarServicosGerente();
        },
        error: (err) => {
          console.error('Erro ao cadastrar serviço', err);
          // Implementar tratamento de erro
        }
      });
    }
  }

  selecionarServico(servico: any): void {
    this.servicoSelecionado = servico;
    console.log("Serviço selecionado:", this.servicoSelecionado);
  }

  editarServico(): void {
    if (this.servicoSelecionado) {
      const dialogRef = this.dialog.open(ModalEditarServicoComponent, {
        data: { 
          idServico: this.servicoSelecionado.idServico,
          descricao: this.servicoSelecionado.descricao,
          valorClaro: this.servicoSelecionado.valorClaro,
          valorMacedo: this.servicoSelecionado.valorMacedo,
          tipoServico: this.servicoSelecionado.tipoServico 
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('O modal foi fechado.');
        // Lógica após fechar o modal
      });
    } else {
      console.log("Nenhum usuário selecionado.");
    }
  }

  excluirServico(): void {
    if(this.servicoSelecionado) {
      if (confirm(`Confirma a exclusão do serviço ${this.servicoSelecionado.descricao}?`)) {
        this.servicoService.excluirServico(this.servicoSelecionado.idServico).subscribe({
          next: () => {
            alert('Serviço excluído com sucesso.');

            this.carregarServicos();
            this.carregarServicosGerente();
          },
          error: (err) => {
            console.error('Erro ao excluir o serviço', err);
          }
        });
      }
    } else {
      alert('Por favor, selecione um serviço para excluir.');
    }

  }

}

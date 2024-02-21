import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicoService } from 'src/app/core/services/servico.service';

@Component({
  selector: 'app-modal-editar-servico',
  templateUrl: './modal-editar-servico.component.html',
  styleUrls: ['./modal-editar-servico.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalEditarServicoComponent implements	OnInit {

  editadoComSucesso: boolean = false;
  erroEditar: boolean = false;
  mensagemErro: string = '';
  tiposServico: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalEditarServicoComponent>,
    private servicoService: ServicoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarTiposServico();
  }

  salvarAlteracoes(): void {
    const dadosAtualizados = {
      idServico: this.data.idServico,
      descricao: this.data.descricao,
      valorClaro: this.data.valorClaro,
      valorMacedo: this.data.valorMacedo,
      tipoServico: this.data.novoTipoServico || this.data.tipoServico // Fallback para o tipo atual se nenhum novo for selecionado
    };

    console.log('Dados a serem atualizados', dadosAtualizados);

    this.servicoService.editarServico(dadosAtualizados)
    .subscribe({
      next: (res) => {
        // Tratar sucesso
        this.editadoComSucesso = true;
        alert('Serviço atualizado com sucesso');
        this.dialogRef.close(true);
      },
      error: (erro) => {
        // Tratar erros
        this.erroEditar = true;
        this.mensagemErro = 'Erro ao atualizar serviço';
        console.error('Erro ao atualizar', erro);
      }
    });
  }

  carregarTiposServico(): void {
    this.servicoService.getTiposServico().subscribe({
      next: (tipos) => {
        this.tiposServico = tipos;
        this.data.novoTipoServico = this.data.tipoServico; // Defina o valor padrão após os tipos serem carregados
      },
      error: (err) => console.error('Erro ao carregar tipos de serviço', err)
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  fecharModalErro(): void {
    this.erroEditar = false;
    this.mensagemErro = '';
  }

}

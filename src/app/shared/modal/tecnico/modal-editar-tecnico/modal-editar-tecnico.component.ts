import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TecnicoService } from 'src/app/core/services/tecnico.service';

@Component({
  selector: 'app-modal-editar-tecnico',
  templateUrl: './modal-editar-tecnico.component.html',
  styleUrls: ['./modal-editar-tecnico.component.scss']
})
export class ModalEditarTecnicoComponent {
  editadoComSucesso: boolean = false;
  erroEditar: boolean = false;
  mensagemErro: string = '';

  constructor(
    private dialogRef: MatDialogRef<ModalEditarTecnicoComponent>,
    private tecnicoService: TecnicoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {}

  salvarAlteracoes(): void {
    const dadosAtualizados = {
      idTecnico: this.data.idTecnico,
      nome: this.data.nome,
      cpf: this.data.cpf,
      login: this.data.login,
      placa: this.data.placa,
    };

    console.log('Dados a serem atualizados', dadosAtualizados);

    this.tecnicoService.editarTecnico(dadosAtualizados)
    .subscribe({
      next: (res) => {
        // Tratar sucesso
        this.editadoComSucesso = true;
        alert('Técnico atualizado com sucesso');
        this.dialogRef.close(true);
      },
      error: (erro) => {
        // Tratar erros
        this.erroEditar = true;
        this.mensagemErro = 'Erro ao atualizar técnico';
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

}


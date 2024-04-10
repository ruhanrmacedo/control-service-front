import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ContratoExecutadoImpressao } from 'src/app/core/types/type';

@Component({
  selector: 'app-modal-comissao',
  templateUrl: './modal-comissao.component.html',
  styleUrls: ['./modal-comissao.component.scss']
})
export class ModalComissaoComponent {

  nomeTecnico: string;
  contratosExecutadosDataSource: MatTableDataSource<ContratoExecutadoImpressao>;
  comissaoTotal: number;
  displayedColumns: string[] = ['contrato', 'os', 'data', 'descricaoServico', 'comissao'];

  constructor(
    private dialogRef: MatDialogRef<ModalComissaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.nomeTecnico = data.nomeTecnico;
    this.contratosExecutadosDataSource = data.contratosExecutadosDataSource;
    this.comissaoTotal = data.comissaoTotal;
  }


  printContent() {
    window.print();
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

}

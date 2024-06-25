import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ContratoExecutadoImpressao } from 'src/app/core/types/type';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  generatePDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const columns = ['Contrato', 'OS', 'Data', 'Descrição Serviço', 'Gratificação'];
    const rows = this.contratosExecutadosDataSource.data.map((row: any) => [
      row.contrato,
      row.os,
      row.data,
      row.descricaoServico,
      row.comissao
    ]);

    pdf.text(`Relatório de Comissão - ${this.nomeTecnico}`, 10, 10);
    (pdf as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      theme: 'striped',
      styles: {
        cellPadding: 1, // Ajuste o valor conforme necessário para diminuir o espaçamento entre as linhas
        fontSize: 5 // Ajuste o tamanho da fonte conforme necessário
      }
    });

    const finalY = (pdf as any).lastAutoTable.finalY; // Pegue a última posição y da tabela
    pdf.text(`Gratificação Total: R$${this.comissaoTotal.toFixed(2)}`, 10, finalY + 10);

    pdf.save('comissao.pdf');
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}

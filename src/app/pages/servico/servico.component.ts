import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicoService } from 'src/app/core/services/servico.service';
import { ChangeDetectorRef } from '@angular/core';
import { Servico, ServicoGerente } from 'src/app/core/types/type';

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
  
  
  constructor(private changeDetectorRef: ChangeDetectorRef, private fb: FormBuilder, private servicoService: ServicoService) {
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
    this.servicoService.listarServicos().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.servicos = data.content;
        console.log('Serviços após atribuição:', this.servicos);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar serviços', err)
    });
  }

  carregarServicosGerente(): void {
    this.servicoService.listarServicosGerente().subscribe({
      next: (data) => {
        console.log('Dados Serviço Gerente recebidos:', data);
        this.servicosGerente = data.content;
        console.log('Serviços Gerente após atribuição:', this.servicosGerente);
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar serviços', err);
        console.log(err); // Adicione isto para ver o erro detalhado
      }
    });
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
        },
        error: (err) => {
          console.error('Erro ao cadastrar serviço', err);
          // Implementar tratamento de erro
        }
      });
    }
  }

}

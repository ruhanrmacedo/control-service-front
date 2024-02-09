import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicoService } from 'src/app/core/services/servico.service';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss']
})
export class ServicoComponent {
  servicoForm: FormGroup;
  tiposServico: any[] = [];
  
  constructor(private fb: FormBuilder, private servicoService: ServicoService) {
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

  onSubmit(): void {
    if (this.servicoForm.valid) {
      this.servicoService.cadastrarServico(this.servicoForm.value).subscribe({
        next: (res) => {
          console.log('Serviço cadastrado com sucesso!', res);
          // Implementar ações após o sucesso, como limpar o formulário ou mostrar uma mensagem
        },
        error: (err) => {
          console.error('Erro ao cadastrar serviço', err);
          // Implementar tratamento de erro
        }
      });
    }
  }

}

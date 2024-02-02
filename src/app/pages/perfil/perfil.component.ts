import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { EditableField } from 'src/app/core/types/type';
import { ModalAlterarSenhaComponent } from 'src/app/shared/modal/perfil/modal-alterar-senha/modal-alterar-senha.component';
import { ModalEditarUsuarioComponent } from 'src/app/shared/modal/perfil/modal-editar-usuario/modal-editar-usuario.component';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  usuarios: any[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'login', 'tipoUsuario', 'dataAtivacao', 'dataInativacao'];
  mostrarTabelaUsuarios: boolean = false;
  usuarioSelecionado: any = null;

  //id: number = 0;
  nome: string = '';
  cpf: string = '';
  login: string = '';
  element: any;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef) {
  }

  get usuarioLogado(): string {
    return this.authService.getCurrentUsuarioLogado();
  }

  get cpfUsuarioLogado(): string {
    return this.authService.getCurrentCpfUsuarioLogado();
  }

  get loginUsuarioLogado(): string {
    return this.authService.getCurrentLoginUsuarioLogado();
  }

  get tipoUsuarioLogado(): string {
    return this.authService.getCurrentTipoUsuarioLogado();
  }

  get usuarioId(): number {
    return this.authService.getCurrentUsuarioId();
  }

  editStates: Record<EditableField, boolean> = {
    //id: false,
    nome: false,
    cpf: false,
    login: false
  };

  originalValues = {
    //id: '',
    nome: '',
    cpf: '',
    login: ''
  };

  ngOnInit(): void {
    this.authService.fetchCurrentUsuarioLogado();
    //this.id = this.usuarioId;
    this.nome = this.usuarioLogado;
    this.cpf = this.cpfUsuarioLogado;
    this.login = this.loginUsuarioLogado;
    this.originalValues.nome = this.usuarioLogado;
    this.originalValues.cpf = this.cpfUsuarioLogado;
    this.originalValues.login = this.loginUsuarioLogado;
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.authService.listarTodosUsuarios().subscribe(data => {
      this.usuarios = data.content;
    });
  }

  toggleTabelaUsuarios() {
    this.mostrarTabelaUsuarios = !this.mostrarTabelaUsuarios;
    console.log("mostrarTabelaUsuarios:", this.mostrarTabelaUsuarios);
  }

  toggleEdit(field: EditableField): void {
    this.editStates[field] = !this.editStates[field];
    if (!this.editStates[field]) {
      this[field] = this.originalValues[field];
    }
  }

  salvarAlteracoes(field: EditableField): void {
    const usuarioId = this.authService.getCurrentUsuarioId();
    console.log('ID do Usuário:', usuarioId);

    if (usuarioId) {
      const dadosAtualizados = { id: usuarioId, [field]: this[field] };

      this.authService.atualizarUsuario(dadosAtualizados).subscribe({
        next: (resposta) => {
          this.authService.atualizarInformacoesUsuarioLogado(resposta);

          this.nome = resposta.nome;
          this.cpf = resposta.cpf;
          this.login = resposta.login;

          this.cdRef.detectChanges();

          alert(`${field.charAt(0).toUpperCase() + field.slice(1)} atualizado com sucesso!`);
        },
        error: (erro) => {
          console.error('Erro ao atualizar', erro);
        }
      });
    }

  }

  cancelarAlteracoes(field: EditableField): void {
    console.log(`Cancelando alterações no campo ${field}`);
    this.editStates[field] = false;
  }

  abrirModalAlterarSenha(): void {
    const dialogRef = this.dialog.open(ModalAlterarSenhaComponent, {
      width: '50%'
    })

  }

  selecionarUsuario(usuario: any): void {
    this.usuarioSelecionado = usuario;
    console.log("Usuário selecionado:", this.usuarioSelecionado);
  }

  editarUsuario(): void {
    if (this.usuarioSelecionado) {
      const dialogRef = this.dialog.open(ModalEditarUsuarioComponent, {
        data: { 
          usuarioId: this.usuarioSelecionado.id,
          nome: this.usuarioSelecionado.nome,
          cpf: this.usuarioSelecionado.cpf,
          login: this.usuarioSelecionado.login,
          tipoUsuario: this.usuarioSelecionado.tipoUsuario 
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
}

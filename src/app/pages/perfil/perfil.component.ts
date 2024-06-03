import { Component, ChangeDetectorRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { EditableField, Usuario } from 'src/app/core/types/type';
import { ModalAlterarSenhaComponent } from 'src/app/shared/modal/perfil/modal-alterar-senha/modal-alterar-senha.component';
import { ModalEditarUsuarioComponent } from 'src/app/shared/modal/perfil/modal-editar-usuario/modal-editar-usuario.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, AfterViewInit {
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'login', 'tipoUsuario', 'dataAtivacao', 'dataInativacao'];
  mostrarTabelaUsuarios: boolean = false;
  usuarioSelecionado: any = null;
  usuariosDataSource = new MatTableDataSource<Usuario>([]);
  totalUsuarios = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  nome: string = '';
  cpf: string = '';
  login: string = '';
  element: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    public dialog: MatDialog) { }

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
    nome: false,
    cpf: false,
    login: false
  };

  originalValues = {
    nome: '',
    cpf: '',
    login: ''
  };

  ngOnInit(): void {
    this.authService.fetchCurrentUsuarioLogado();
    this.nome = this.usuarioLogado;
    this.cpf = this.cpfUsuarioLogado;
    this.login = this.loginUsuarioLogado;
    this.originalValues.nome = this.usuarioLogado;
    this.originalValues.cpf = this.cpfUsuarioLogado;
    this.originalValues.login = this.loginUsuarioLogado;
    this.listarUsuarios(0, 10); // Listar usuários na página perfil
  }

  // Método executado após a inicialização da visualização
  ngAfterViewInit() {
    // O paginator será configurado após a inicialização da visualização
    this.usuariosDataSource.paginator = this.paginator;
  }

  // Método para listar usuários com paginação
  listarUsuarios(page: number, size: number): void {
    this.usuarioService.listarTodosUsuarios(page, size).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data);
        this.usuariosDataSource.data = data.content; // Atribui os dados recebidos à fonte de dados da tabela
        this.totalUsuarios = data.totalElements; // Total de usuários para a paginação
        this.changeDetectorRef.detectChanges(); // Força a detecção de mudanças para atualizar a visualização
      },
      error: (err) => console.error('Erro ao listar usuários', err)
    });
  }

  // Método para lidar com eventos de paginação
  handlePageEvent(event: PageEvent) {
    // Chama listarUsuarios com os novos parâmetros de página e tamanho
    this.listarUsuarios(event.pageIndex, event.pageSize);
  }

  // Método para alternar a exibição da tabela de usuários
  toggleTabelaUsuarios() {
    this.mostrarTabelaUsuarios = !this.mostrarTabelaUsuarios;
    console.log("mostrarTabelaUsuarios:", this.mostrarTabelaUsuarios);
  }

  // Método para alternar o estado de edição dos campos
  toggleEdit(field: EditableField): void {
    this.editStates[field] = !this.editStates[field];
    if (!this.editStates[field]) {
      this[field] = this.originalValues[field];
    }
  }

  // Método para salvar as alterações feitas nos campos
  salvarAlteracoes(field: EditableField): void {
    const usuarioId = this.authService.getCurrentUsuarioId();
    if (usuarioId) {
      const dadosAtualizados = { id: usuarioId, [field]: this[field] };

      this.authService.atualizarUsuario(dadosAtualizados).subscribe({
        next: (resposta) => {
          this.authService.atualizarInformacoesUsuarioLogado(resposta);

          this.nome = resposta.nome;
          this.cpf = resposta.cpf;
          this.login = resposta.login;

          this.changeDetectorRef.detectChanges();
          alert(`${field.charAt(0).toUpperCase() + field.slice(1)} atualizado com sucesso!`);
        },
        error: (erro) => {
          console.error('Erro ao atualizar', erro);
        }
      });
    }
  }

  // Método para cancelar as alterações feitas nos campos
  cancelarAlteracoes(field: EditableField): void {
    this.editStates[field] = false;
  }

  // Método para abrir o modal de alteração de senha
  abrirModalAlterarSenha(): void {
    this.dialog.open(ModalAlterarSenhaComponent, {
      width: '50%'
    });
  }

  // Método para selecionar um usuário na tabela
  selecionarUsuario(usuario: any): void {
    this.usuarioSelecionado = usuario;
  }

  // Método para abrir o modal de edição de usuário
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
      dialogRef.afterClosed().subscribe(() => {
        this.listarUsuarios(this.paginator.pageIndex, this.paginator.pageSize);
      });
    }
  }

  // Método para desligar (inativar) um usuário
  desligarUsuario(): void {
    if (this.usuarioSelecionado) {
      const confirmacao = confirm(`Confirma a exclusão do usuário ${this.usuarioSelecionado.nome}?`);
      if (confirmacao) {
        const dataAtual = new Date().toISOString().slice(0, 10);
        this.usuarioService.desligarUsuario(this.usuarioSelecionado.id, dataAtual).subscribe({
          next: () => {
            alert('Usuário desligado com sucesso.');
            this.listarUsuarios(this.paginator.pageIndex, this.paginator.pageSize);
          },
          error: (erro) => {
            console.error('Erro ao desligar o usuário', erro);
          }
        });
      }
    }
  }

  // Método para readmitir (reativar) um usuário
  readmitirUsuario(): void {
    if (this.usuarioSelecionado) {
      const confirmacao = confirm(`Confirma a readmissão do usuário ${this.usuarioSelecionado.nome}?`);
      if (confirmacao) {
        this.usuarioService.readmitirUsuario(this.usuarioSelecionado.id).subscribe({
          next: () => {
            alert('Usuário readmitido com sucesso.');
            this.listarUsuarios(this.paginator.pageIndex, this.paginator.pageSize);
          },
          error: (erro) => {
            console.error('Erro ao readmitir o usuário', erro);
            alert(erro.message || 'Erro ao readmitir o usuário. ' + erro);
          }
        });
      }
    }
  }

  // Método para verificar se o usuário está logado
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Método para verificar se o usuário logado é ROOT ou GERENTE
  get isRootOrGerente(): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuarioLogado');
    return tipoUsuario === 'ROOT' || tipoUsuario === 'GERENTE';
  }
}

import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { EditableField, Usuario } from 'src/app/core/types/type';
import { ModalAlterarSenhaComponent } from 'src/app/shared/modal/perfil/modal-alterar-senha/modal-alterar-senha.component';
import { ModalEditarUsuarioComponent } from 'src/app/shared/modal/perfil/modal-editar-usuario/modal-editar-usuario.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'login', 'tipoUsuario', 'dataAtivacao', 'dataInativacao'];
  mostrarTabelaUsuarios: boolean = false;
  usuarioSelecionado: any = null;
  usuariosDataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //id: number = 0;
  nome: string = '';
  cpf: string = '';
  login: string = '';
  element: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
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
    this.listarUsuarios();
  }

  carregarUsuarios(): void {
    this.authService.listarTodosUsuarios().subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        this.usuarios = data.content;
        console.log('Usuarios após atribuição:', this.usuarios);
        this.changeDetectorRef.detectChanges();
    },
    error: (err) => console.error('Erro ao carregar tipos de usuarios', err)  
    });
  }

  ngAfterViewInit() {
    this.listarUsuarios();
  }

  //Listar usuários para a tabela em page perfil
  listarUsuarios(): void {
    this.usuarioService.listarTodosUsuarios(0, 20).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data);
        this.usuariosDataSource = new MatTableDataSource<Usuario>(data.content);
        this.changeDetectorRef.detectChanges();
        this.usuariosDataSource.paginator = this.paginator;
        console.log('Dados após atribuição:', this.usuariosDataSource.data);
      }
    })
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

  desligarUsuario(): void {
    if(this.usuarioSelecionado) {
      const confirmacao = confirm(`Confirma a exclusão do usuário ${this.usuarioSelecionado.nome}?`);
      if (confirmacao) {
        // Gere a data atual e formate como 'YYYY-MM-DD'
        const dataAtual = new Date().toISOString().slice(0, 10);
  
        // Passe o ID e a data de inativação para o serviço
        this.usuarioService.desligarUsuario(this.usuarioSelecionado.id, dataAtual).subscribe({
          next: () => {
            alert('Usuário desligado com sucesso.');
            this.carregarUsuarios(); // Recarrega a lista de usuários
          },
          error: (erro) => {
            console.error('Erro ao desligar o usuário', erro);
          }
        });
      }
    } else {
      alert('Por favor, selecione um usuário para excluir.');
    }
  }

  readimitirUsuario(): void {
    if(this.usuarioSelecionado) {
      const confirmacao = confirm(`Confirma a readmissão do usuário ${this.usuarioSelecionado.nome}?`);
      if (confirmacao) {
        // Passe o ID e a data de inativação para o serviço
        this.usuarioService.readmitirUsuario(this.usuarioSelecionado.id).subscribe({
          next: () => {
            alert('Usuário readmitido com sucesso.');
            this.carregarUsuarios(); // Recarrega a lista de usuários
          },
          error: (erro) => {
            console.error('Erro ao readmitir o usuário', erro);
            alert(erro.message || 'Erro ao readmitir o usuário. ' + erro);
          }
        });
      }
    } else {
      alert('Por favor, selecione um usuário para readmitir.');
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isRootOrGerente(): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuarioLogado');
    return tipoUsuario === 'ROOT' || tipoUsuario === 'GERENTE';
  }
}

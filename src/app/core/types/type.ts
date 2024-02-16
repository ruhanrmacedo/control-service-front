export interface Usuario {
    id: number;
    nome: string;
    cpf: string;
    login: string;
    tipoUsuario: string;
    dataAtivacao: Date;
    dataInativacao: Date;
    // Adicione outros campos conforme necessário
  }

export type EditableField = 'nome' | 'cpf' | 'login';

export interface Servico {
  idServico: number;
  descricao: string;
  valorClaro: number;
  valorMacedo: number;
  tipoServico: string;

}



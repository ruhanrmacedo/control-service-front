export interface Usuario {
    id: number;
    nome: string;
    cpf: string;
    login: string;
    tipoUsuario: string;
    // Adicione outros campos conforme necessário
  }

export type EditableField = 'nome' | 'cpf' | 'login';

export interface Servico {
  idServico: number;
  descricao: string;
  valorClaro: number;
  valorMacedos: number;
  tipoServico: string;

}


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

}

export interface ServicoGerente {
  idServico: number;
  descricao: string;
  valorClaro: number;
  valorMacedo: number;
  tipoServico: string;
  ativo: boolean;
}

export interface Tecnico {
  idTecnico: number;
  nome: string;
  login: string;
  placa: string;
  dataAdmissao: Date;
}

export interface TecnicoGerente {
  idTecnico: number;
  nome: string;
  cpf: string;
  login: string;
  placa: string;
  dataAdmissao: Date;
  dataDesligamento: Date;
}


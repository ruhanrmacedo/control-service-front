export interface Usuario {
    id: number;
    nome: string;
    cpf: string;
    login: string;
    tipoUsuario: string;
    dataAtivacao: Date;
    dataInativacao: Date;
  }

export type EditableField = 'nome' | 'cpf' | 'login';

export interface Servico {
  idServico: number;
  descricao: string;

}

export interface ServicoGerente {
  idServico: number;
  descricao: string;
  valor1: number;
  valor2: number;
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

export interface RegistroServicoDTO {
  contrato: string;
  os: string;
  data: string;
  idTecnico: number;
  idServico: number;
  valor1?: number;
  valor2?: number;
}

export interface listarServicosExecutadosAdmDTO {
  contrato: string;
  os: string;
  data: string;
  idTecnico: number;
  idServico: number;
}

export interface ResumoMensalServicoDTO {
  quantidadeServicos: number;
  valorTotal1: number;
  valorTotal2: number;
}

export interface ResumoMensalAdmDTO {
  quantidadeServicos: number;
}

export interface ContratoExecutadoDTO {
  id: number;
  contrato: string;
  os: string;
  data: string;
  nomeTecnico: number;
  descricaoServico: number;
  valor1?: number;
  valor2?: number;
  comissao?: number;
}

export interface ContratoExecutadoImpressao {
  contrato: string;
  os: string;
  data: string;
  descricaoServico: number;
  comissao?: number;
}

export interface ServicoExecutadoAdmListagemDTO {
  id: number;
  contrato: string;
  os: string;
  data: string;
  nomeTecnico: string;
  descricaoServico: string;
}

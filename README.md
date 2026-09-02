# Control Service — Frontend

Interface web para administração de serviços técnicos, técnicos responsáveis, registros executados, comissões e resumos operacionais.

## Sobre o projeto

O Control Service organiza o fluxo de cadastro e acompanhamento de serviços técnicos. Este repositório contém o frontend em Angular e consome uma API Spring Boot mantida separadamente.

A interface permite registrar informações operacionais, acompanhar resultados em painéis e gerar documentos de apoio a partir dos dados retornados pelo backend.

## Contexto e evolução

O sistema nasceu no contexto de um Trabalho de Conclusão de Curso e recebeu evolução posterior de forma autoral. A versão atual amplia o escopo acadêmico original com autenticação, gestão operacional, indicadores, comissões e exportações.

## Funcionalidades

- autenticação de usuários;
- consulta e atualização de perfil;
- alteração de senha;
- gestão de técnicos;
- gestão de serviços;
- registro e edição de serviços executados;
- dashboard operacional;
- resumos mensal e quinzenal;
- cálculo e visualização de comissões;
- gráficos de evolução de valores;
- gráficos de contratos por técnico;
- exportação do resumo quinzenal em XLSX;
- exportação de comissão em PDF com tabela.

## Tecnologias

- Angular 17;
- TypeScript;
- Angular Router;
- Angular HttpClient;
- Angular Material;
- Angular CDK;
- Reactive Forms;
- RxJS;
- jwt-decode;
- ngx-charts;
- XLSX;
- jsPDF e jspdf-autotable.

## Arquitetura

O frontend utiliza os recursos nativos do ecossistema Angular para separar telas, acesso à API e componentes compartilhados:

- **pages:** telas principais, como painel, técnicos, serviços e perfil;
- **core/services:** comunicação com endpoints de autenticação, usuários, técnicos, serviços, registros e comissões;
- **shared:** layout, cards, diálogos e componentes reutilizáveis;
- **roteamento:** organização dos fluxos navegáveis da aplicação;
- **HttpClient:** comunicação com o backend;
- **interceptor:** inclusão do token JWT no cabeçalho `Authorization`;
- **Reactive Forms:** formulários e validações de interface;
- **Angular Material:** componentes e diálogos da interface.

A sessão autenticada utiliza dados mantidos no armazenamento local do navegador. O frontend depende das regras de segurança e autorização implementadas pela API.

## Estrutura resumida

```text
src/app/
├── core/
│   └── services/     # Serviços de acesso à API
├── pages/            # Telas e fluxos principais
├── shared/           # Layout e componentes reutilizáveis
├── app-routing.*     # Definição das rotas
└── auth.interceptor* # Envio do token JWT
```

## Backend relacionado

A API utilizada por este frontend está disponível em:

- [Control Service — API](https://github.com/ruhanrmacedo/controlService)

## Executando localmente

### Requisitos

- Node.js compatível com as dependências do projeto;
- npm;
- API Control Service disponível.

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm start
```

O script utiliza o Angular CLI com a configuração de proxy presente em `proxy.conf.json`.

### Build

```bash
npm run build
```

### Outros scripts

```bash
npm run watch
npm test
```

Os testes não foram executados durante a preparação desta documentação.

## Testes

O repositório contém arquivos `.spec.ts` associados a componentes e serviços. Parte dessa estrutura deriva do scaffold do Angular, e a cobertura funcional do sistema ainda é limitada.

## Screenshots

O repositório contém imagens históricas em `src/assets/imagens`, incluindo referências ao painel, técnicos e cadastro de serviços. Antes de incorporá-las ao README, elas devem ser revisadas quanto à atualidade e à presença de dados reais.

Screenshots profissionais serão adicionados futuramente com dados exclusivamente fictícios. Os cenários recomendados são:

- dashboard;
- gestão de técnicos;
- cadastro de serviço;
- registro de serviço executado;
- comissão;
- resumo quinzenal e exportações.

## Estado atual

O Control Service é um projeto de origem acadêmica, posteriormente ampliado. As funcionalidades operacionais principais estão implementadas, enquanto documentação, testes e apresentação visual seguem em processo de modernização.

## Autoria

Desenvolvido por **Ruhan Macedo**.

## Licença

Este projeto ainda não possui uma licença pública definida.

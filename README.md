# GestWay

O **GestWay** é uma plataforma web desenvolvida para facilitar a gestão de lojas virtuais, permitindo que vendedores administrem produtos, conteúdos e a identidade visual de seus e-commerces de forma simples, intuitiva e sem depender de suporte técnico.

O sistema centraliza todas as funcionalidades administrativas em um único painel, oferecendo autonomia para atualização de produtos, gerenciamento de estoque, acompanhamento de vendas, emissão de relatórios e personalização da loja.

## Objetivo

Desenvolver uma plataforma de gestão centralizada para e-commerce que permita aos vendedores administrar suas lojas virtuais com praticidade, reduzindo a dependência de desenvolvedores para alterações rotineiras.

## Objetivos Específicos

* Identificar as principais dificuldades enfrentadas pelos vendedores na administração de lojas virtuais.
* Desenvolver uma interface intuitiva e responsiva para facilitar a utilização da plataforma.
* Implementar funcionalidades para gerenciamento de produtos, estoque, vendedores, vouchers e identidade visual da loja.
* Estruturar um banco de dados seguro e eficiente utilizando MySQL.
* Validar a usabilidade do sistema por meio de testes e feedback dos usuários.

## Funcionalidades

* Dashboard com indicadores de desempenho
* Gerenciamento de produtos
* Gerenciamento de categorias
* Controle de estoque
* Cadastro e gerenciamento de vendedores
* Controle de vendas
* Relatórios gerenciais
* Cadastro de vouchers
* Personalização da identidade visual da loja
* Configuração de banners e grids promocionais
* Pré-visualização das alterações antes da publicação
* Sistema de autenticação com JWT

## Tecnologias Utilizadas

### Front-end

* React.js
* Vite

### Back-end

* Node.js
* Express.js
* MySQL
* JWT (JSON Web Token)

### Ferramentas

* VS Code
* Figma
* Vercel
* Render
* Scrum

## Metodologia

O desenvolvimento do GestWay segue a metodologia ágil **Scrum**, permitindo entregas incrementais, organização das atividades e evolução contínua do sistema através de reuniões, planejamento de sprints e validação constante das funcionalidades implementadas.

## Desenvolvimento

O sistema foi dividido em módulos para facilitar sua organização e manutenção.

### Módulos implementados

* Autenticação de usuários
* Dashboard
* Vendas
* Vendedores
* Produtos
* Categorias
* Controle de estoque
* Relatórios
* Vouchers
* Personalização da identidade visual da loja

## Estrutura do Projeto

```text
gestway/
│
├── frontend/
├── backend/
└── README.md
```

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, tenha instalado em sua máquina:

* Node.js
* npm
* MySQL

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>

cd gestway
```

### 2. Configurar o Back-end

Acesse a pasta do servidor:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` utilizando o arquivo `.env.example` disponível no projeto como referência para preencher todas as variáveis de ambiente necessárias.

Se for a primeira vez, execute a inicialização completa:

```bash
npm run dev:full
```

Caso já tenha feito a inicialização completa, faça uma inicialização simples:

```bash
npm run dev
```

O back-end estará disponível em:

```
http://localhost:3000
```

### 3. Configurar o Front-end

Abra um novo terminal e acesse a pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

O front-end estará disponível em:

```
http://localhost:5173
```
---
© 2026 GestWay

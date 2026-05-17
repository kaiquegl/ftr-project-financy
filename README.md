# Financy

Aplicação web para gestão financeira pessoal, desenvolvida como projeto de conclusão de pós-graduação da [Rocketseat](https://www.rocketseat.com.br/).

## Objetivo do projeto

Entregar uma solução full stack para autenticação de usuários e gerenciamento de transações/categorias financeiras, garantindo isolamento de dados por usuário e boa experiência de uso no front-end.

## Requisitos atendidos

### Funcionais (Back-end e Front-end)

- [x] Criar conta e fazer login
- [x] Ver e gerenciar apenas transações e categorias do usuário autenticado
- [x] Criar transação
- [x] Editar transação
- [x] Deletar transação
- [x] Listar transações (com paginação e filtros)
- [x] Criar categoria
- [x] Editar categoria
- [x] Deletar categoria (com regra de proteção quando há transações vinculadas)
- [x] Listar categorias

### Não funcionais

- [x] TypeScript
- [x] GraphQL
- [x] Prisma
- [x] SQLite
- [x] React
- [x] Vite (sem framework)

## Stack utilizada

### Back-end

- Bun
- Elysia
- GraphQL Yoga
- Prisma + SQLite (adapter libsql)
- Zod

### Front-end

- React 19 + Vite
- TanStack Router
- TanStack Query
- GraphQL Request
- React Hook Form + Zod
- Tailwind CSS
- Base UI / Shadcn UI

## Como rodar o projeto

### Pré-requisitos

- Bun instalado
- PNPM instalado

### 1) Subir o back-end

```bash
cd backend
bun install
```

Copie `backend/.env.example` para `backend/.env` (os valores padrão já funcionam localmente).

```bash
bun run db:generate
bun run db:migrate
bun run dev
```

API GraphQL disponível em: `http://localhost:3333/graphql`

### 2) Subir o front-end

```bash
cd frontend
pnpm install
```

Copie `frontend/.env.example` para `frontend/.env`.

```bash
pnpm dev
```

Aplicação disponível em: `http://localhost:5173`

## Fluxos principais da aplicação

- **Autenticação**
  - Cadastro (`registerUser`)
  - Login (`login`)
  - Logout (`logout`)
  - Perfil do usuário autenticado (`me` e `updateUser`)

- **Categorias**
  - CRUD completo de categorias
  - Overview com total de categorias, total de transações e categoria mais utilizada
  - Regra de proteção para impedir remoção de categoria com transações vinculadas

- **Transações**
  - CRUD completo de transações
  - Listagem paginada
  - Filtros por descrição, tipo, categoria e período

## Segurança e regras de domínio

- Sessão baseada em cookie (`HttpOnly`) no back-end
- Requisições GraphQL do front-end enviadas com `credentials: "include"`
- CORS configurado com `credentials: true` e origem do front-end por variável de ambiente
- Todas as consultas/mutações sensíveis exigem usuário autenticado
- Queries e mutações de categorias/transações sempre filtram por `userId`

## Estrutura do repositório

```text
.
├── backend/        # API GraphQL, autenticação e persistência
├── frontend/       # Aplicação React (rotas, telas e integração GraphQL)
├── .cursor/rules/  # Regras de ambiente e tooling do projeto
└── AGENTS.md       # Padrões de qualidade e lint/format
```

## Scripts úteis

### Back-end (`backend/package.json`)

- `bun run dev` - ambiente de desenvolvimento
- `bun run start` - execução padrão
- `bun run db:generate` - gerar cliente Prisma
- `bun run db:migrate` - aplicar migrações
- `bun run db:studio` - abrir Prisma Studio

### Front-end (`frontend/package.json`)

- `pnpm dev` - ambiente de desenvolvimento
- `pnpm build` - build de produção
- `pnpm typecheck` - checagem de tipos
- `pnpm preview` - preview da build

### Qualidade (`package.json` da raiz)

- `npm run check` - checa padrões com Ultracite
- `npm run fix` - corrige padrões com Ultracite

## Status atual

- Módulos de autenticação, categorias e transações entregues e integrados entre front-end e back-end.
- Dashboard inicial presente (`/_dash`) como base para evolução das próximas entregas.

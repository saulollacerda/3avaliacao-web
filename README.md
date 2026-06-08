# BiblioSys — Sistema de Gerenciamento de Biblioteca

Sistema web completo para gerenciamento de biblioteca, desenvolvido como trabalho da 3ª nota da disciplina de Programação Web.

## Objetivo do Sistema

Permitir que bibliotecários gerenciem o acervo de livros e os empréstimos realizados, com controle de estoque automático e dashboard de estatísticas em tempo real.

## Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3 (Composition API) |
| Estado | Pinia |
| Roteamento | Vue Router 4 |
| Estilização | Tailwind CSS |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Banco de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (JWT) |
| Controle de Versão | GitHub |

## Funcionalidades Implementadas

- **Autenticação** — login/logout via Supabase Auth com sessão gerenciada pelo Pinia
- **Proteção de rotas** — guard no Vue Router redireciona para `/login` se não autenticado
- **CRUD de Livros** — cadastrar, listar, editar e excluir livros com controle de quantidade
- **Empréstimos** — registrar empréstimo (decrementa estoque), devolver livro (restitui estoque)
- **Dashboard** — cards de estatísticas: total de livros, disponíveis, empréstimos ativos, devoluções do dia
- **Filtros** — filtrar empréstimos por status (todos / ativos / devolvidos)

## Estrutura do Projeto

```
3nota-web/
├── frontend/
│   └── src/
│       ├── components/   # Navbar, BookModal, LoanModal, ConfirmDialog
│       ├── views/        # LoginView, DashboardView, BooksView, LoansView
│       ├── stores/       # auth.js, books.js, loans.js (Pinia)
│       ├── router/       # index.js com guards
│       └── services/     # api.js (axios + interceptor JWT)
└── backend/
    ├── server.js
    └── src/
        ├── middleware/   # auth.js (valida JWT Supabase)
        └── routes/       # books.js, loans.js
```

## Banco de Dados (Supabase)

Execute o SQL abaixo no editor SQL do Supabase para criar as tabelas:

```sql
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  isbn text,
  genre text,
  year integer,
  total_quantity integer default 1,
  available_quantity integer default 1,
  created_at timestamptz default now()
);

create table loans (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id),
  borrower_name text not null,
  borrower_email text,
  loan_date date not null,
  expected_return_date date not null,
  return_date date,
  status text default 'active',
  created_at timestamptz default now()
);
```

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18+
- Projeto no Supabase criado com as tabelas acima
- Um usuário criado em Authentication > Users no Supabase

### Backend

```bash
cd backend
cp .env.example .env
# Preencha SUPABASE_URL e SUPABASE_ANON_KEY no .env
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env
npm run dev
```

Acesse `http://localhost:5173` e faça login com as credenciais do usuário criado no Supabase.

## Integrantes

| Nome | GitHub |
|---|---|
| Saulo Lacerda | [@saulollacerda](https://github.com/saulollacerda) |

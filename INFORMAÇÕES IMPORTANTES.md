# Soto Café - E-commerce de Cafeteria Gourmet

Sistema completo de e-commerce desenvolvido para venda de cafés gourmet, incluindo frontend React, backend Node.js/Express e banco de dados PostgreSQL.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Deploy no Vercel](#deploy-no-vercel)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [API Endpoints](#api-endpoints)

## 🚀 Tecnologias

### Backend
- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **SQLite** - Banco de dados (arquivo local, não precisa instalar PostgreSQL)
- **better-sqlite3** - Driver SQLite
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas

### Frontend
- **React 18** com **TypeScript**
- **Vite** - Build tool
- **Material-UI (MUI)** - Componentes UI
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado e cache
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
sotocafe/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── config/         # Configurações (banco, etc)
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares (auth, etc)
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços de negócio
│   │   ├── utils/          # Utilitários
│   │   └── server.ts       # Arquivo principal
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Serviços (API)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── database/               # Scripts SQL
│   └── schema.sql          # Schema completo do banco
└── README.md
```

## 📦 Pré-requisitos

- **Node.js** 18+ e npm
- **Git**
- **SQLite** (incluído automaticamente - não precisa instalar nada!)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd sotocafe
```

### 2. Instale as dependências do Backend

```bash
cd backend
npm install
```

### 3. Instale as dependências do Frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configuração

### Backend

1. Copie o arquivo `.env.example` para `.env`:

```bash
cd backend
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações (opcional, já tem valores padrão):

```env
NODE_ENV=development
PORT=3000

# SQLite - não precisa configurar, o banco será criado automaticamente
# O banco será criado em: backend/data/soto_cafe.db

JWT_SECRET=soto_cafe_jwt_secret_dev_change_in_production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

### Frontend

Crie um arquivo `.env` na pasta `frontend`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Executando o Projeto

### Backend

```bash
cd backend
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### Frontend

```bash
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🗄️ Banco de Dados (SQLite)

Este projeto utiliza **SQLite** por padrão, que é um banco de dados em arquivo. **Não é necessário instalar PostgreSQL!**

O banco será criado automaticamente em `backend/data/soto_cafe.db` quando o servidor iniciar.

### Popular o Banco de Dados

**IMPORTANTE:** É necessário popular o banco de dados antes de usar o sistema!

1. Certifique-se de que o **backend** está rodando em `http://localhost:3000`
2. Certifique-se de que o **frontend** está rodando em `http://localhost:5173`
3. Acesse: `http://localhost:5173/popular-banco`
4. Clique no botão **"Popular Banco"**
5. Aguarde alguns segundos até aparecer a mensagem de sucesso
6. Você será redirecionado para a página inicial automaticamente

**Verificar se foi populado:**
- Acesse `http://localhost:5173` e você deve ver produtos na página inicial
- Ou acesse `http://localhost:5173/produtos` para ver todos os produtos
- Tente fazer login com as credenciais abaixo

**Se não funcionar:**
- Verifique se o backend está rodando (acesse `http://localhost:3000/health`)
- Verifique a janela do PowerShell do backend para ver se há erros
- Tente popular novamente

## 🔐 Credenciais de Acesso

Após popular o banco de dados, você pode fazer login com as seguintes credenciais:

### 👨‍💼 Administrador
- **Email:** `admin@sotocafe.com`
- **Senha:** `123456`
- **Tipo:** Administrador
- **Acesso:** Total ao sistema

### 👤 Clientes (Usuários de Teste)

| Nome | Email | Senha | Tipo |
|------|-------|-------|------|
| João Monteiro | `joao@email.com` | `123456` | Cliente |
| Ana Carolina Silva | `ana@email.com` | `123456` | Cliente |
| Roberto Martins | `roberto@email.com` | `123456` | Cliente |
| Maria Santos | `maria@email.com` | `123456` | Cliente |
| Pedro Oliveira | `pedro@email.com` | `123456` | Cliente |
| Carla Ferreira | `carla@email.com` | `123456` | Cliente |
| Lucas Costa | `lucas@email.com` | `123456` | Cliente |
| Fernanda Lima | `fernanda@email.com` | `123456` | Cliente |
| Rafael Souza | `rafael@email.com` | `123456` | Cliente |

### 👨‍💻 Funcionários

| Nome | Email | Senha | Tipo |
|------|-------|-------|------|
| Gerente Conteúdo | `gerente@sotocafe.com` | `123456` | Gerente_Conteudo |
| Expedição | `expedicao@sotocafe.com` | `123456` | Expedicao |

**Nota:** Todas as senhas são `123456` para facilitar os testes.

## 📦 Dados Populados no Sistema

Após popular o banco, o sistema conterá:

### Usuários
- **12 usuários** no total:
  - 1 Administrador
  - 1 Gerente de Conteúdo
  - 1 Expedição
  - 9 Clientes

### Produtos
- **30+ produtos** distribuídos em:
  - **10 Cafés em Grão** (Cerrado Mineiro, Mogiana, Chapada de Minas, Bourbon, Catuaí, Mundo Novo, Acaiá, Geisha, Pacamara, Yellow Bourbon)
  - **5 Cafés Moídos** (Tradicional, Espresso, French Press, Cafeteira Italiana, Premium)
  - **5 Tipos de Cápsulas** (Nespresso, Dolce Gusto, Expresso Intenso, Ristretto, Lungo)
  - **12 Acessórios** (Xícaras, Cafeteiras, Moedores, French Press, Hario V60, Filtros, Balança, Termômetro, Canecas, Kits)
  - **3 Kits** (Iniciante, Barista, Presente)

### Endereços
- **5 endereços** cadastrados para diferentes usuários em:
  - São Paulo (SP)
  - Rio de Janeiro (RJ)
  - Belo Horizonte (MG)
  - Salvador (BA)

### Cupons de Desconto
- **6 cupons** disponíveis:
  - `BEMVINDO10` - 10% de desconto (mínimo R$ 50,00)
  - `FRETEGRATIS` - Frete grátis (mínimo R$ 100,00)
  - `CAFE20` - 20% de desconto (mínimo R$ 80,00)
  - `BLACKFRIDAY` - 30% de desconto (mínimo R$ 150,00)
  - `NATAL25` - 25% de desconto (mínimo R$ 120,00)
  - `PRIMEIRA` - R$ 15,00 de desconto (mínimo R$ 50,00)

### Programa de Fidelidade
- Todos os clientes possuem **150 pontos** de saldo
- Total de **500 pontos** já ganhos (histórico)

## 🚀 Deploy no Vercel

### 1. Preparação

1. Faça push do código para o GitHub
2. Crie uma conta no [Vercel](https://vercel.com)
3. Conecte seu repositório GitHub ao Vercel

### 2. Configurar Variáveis de Ambiente

No painel do Vercel, adicione as variáveis de ambiente:

- `DB_HOST` - Host do banco de dados (ex: do.railway.app)
- `DB_PORT` - Porta do banco (geralmente 5432)
- `DB_NAME` - Nome do banco
- `DB_USER` - Usuário do banco
- `DB_PASSWORD` - Senha do banco
- `JWT_SECRET` - Secret para JWT
- `CORS_ORIGIN` - URL do frontend

### 3. Deploy do Backend

1. No Vercel, crie um novo projeto
2. Selecione a pasta `backend`
3. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Start Command**: `npm start`

### 4. Deploy do Frontend

1. Crie outro projeto no Vercel
2. Selecione a pasta `frontend`
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Adicione a variável de ambiente:
   - `VITE_API_URL` - URL da API backend (ex: https://seu-backend.vercel.app/api)

### 5. Banco de Dados (Opções Gratuitas)

**Opção 1: Supabase**
1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o script `database/schema.sql` no SQL Editor
4. Use as credenciais fornecidas no Vercel

**Opção 2: Railway**
1. Crie uma conta em [railway.app](https://railway.app)
2. Crie um novo projeto PostgreSQL
3. Execute o script `database/schema.sql`
4. Use as credenciais fornecidas no Vercel

**Opção 3: Render**
1. Crie uma conta em [render.com](https://render.com)
2. Crie um novo PostgreSQL Database
3. Execute o script `database/schema.sql`
4. Use as credenciais fornecidas no Vercel

## 📊 Estrutura do Banco de Dados

O banco de dados inclui as seguintes tabelas principais:

- `usuarios` - Usuários do sistema
- `produtos` - Catálogo de produtos
- `categorias` - Categorias de produtos
- `pedidos` - Pedidos realizados
- `item_pedido` - Itens dos pedidos
- `carrinho` - Carrinhos de compras
- `item_carrinho` - Itens do carrinho
- `cupons_desconto` - Cupons de desconto
- `programa_fidelidade` - Programa de pontos
- `enderecos` - Endereços dos usuários
- E mais...

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter perfil (autenticado)

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Obter produto por ID/slug
- `POST /api/produtos` - Criar produto (admin)

### Categorias
- `GET /api/categorias` - Listar categorias
- `GET /api/categorias/:slug` - Obter categoria

### Carrinho
- `GET /api/carrinho` - Obter carrinho (autenticado)
- `POST /api/carrinho/itens` - Adicionar item (autenticado)
- `DELETE /api/carrinho/itens/:id` - Remover item (autenticado)

### Pedidos
- `GET /api/pedidos` - Listar pedidos (autenticado)
- `GET /api/pedidos/:id` - Obter pedido (autenticado)
- `POST /api/pedidos` - Criar pedido (autenticado)

### Usuários
- `GET /api/usuarios/enderecos` - Listar endereços (autenticado)
- `POST /api/usuarios/enderecos` - Adicionar endereço (autenticado)
- `GET /api/usuarios/fidelidade` - Obter programa de fidelidade (autenticado)

## 📝 Notas Importantes

1. **Primeiro Deploy**: Após o primeiro deploy, você precisará executar o script SQL no banco de dados hospedado.

2. **Variáveis de Ambiente**: Certifique-se de configurar todas as variáveis de ambiente no Vercel.

3. **CORS**: O backend está configurado para aceitar requisições do frontend. Ajuste `CORS_ORIGIN` conforme necessário.

4. **JWT Secret**: Use um secret forte e seguro em produção.

5. **Banco de Dados**: Para produção, use um banco de dados hospedado (Supabase, Railway, Render, etc.).

## 👤 Autor

**Tiago Soares Carneiro da Cunha**
- RGM: 44030509

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

---

**Desenvolvido com ☕ para o projeto Soto Café**


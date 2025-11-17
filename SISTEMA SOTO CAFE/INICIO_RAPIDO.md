# 🚀 Início Rápido - Soto Café

## Passos para começar

### 1. Banco de Dados

```bash
# Criar banco
createdb soto_cafe

# Executar schema
psql -U postgres -d soto_cafe -f database/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
# Criar .env com VITE_API_URL=http://localhost:3000/api
npm run dev
```

## 🎯 Próximos Passos

1. **Criar usuário administrador** (via SQL ou API)
2. **Adicionar produtos** (via API ou diretamente no banco)
3. **Testar o sistema** navegando pelo frontend

## 📦 Deploy no Vercel

1. Faça push para GitHub
2. Conecte o repositório no Vercel
3. Configure variáveis de ambiente
4. Deploy automático!

## 🔗 Links Úteis

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

---

**Pronto para começar! ☕**


# 📦 Como Popular o Banco de Dados

## Executar o Script de Seed

Para popular o banco de dados com dados de exemplo, execute:

### Opção 1: Via linha de comando

```bash
psql -U postgres -d soto_cafe -f seed.sql
```

### Opção 2: Via psql interativo

```bash
psql -U postgres -d soto_cafe
```

Depois execute:
```sql
\i seed.sql
```

## 📋 Dados que serão inseridos:

### Usuários (senha padrão: `123456`)
- **admin@sotocafe.com** - Administrador
- **joao@email.com** - Cliente
- **ana@email.com** - Cliente  
- **roberto@email.com** - Cliente

### Produtos
- 3 Cafés em Grão
- 2 Cafés Moídos
- 1 Cápsulas
- 3 Acessórios

### Outros
- Endereços para os clientes
- Programa de fidelidade com pontos
- Cupons de desconto (BEMVINDO10, FRETEGRATIS, CAFE20)
- 2 Pedidos de exemplo
- Configurações de frete

## 🔐 Credenciais de Login

**Email:** admin@sotocafe.com  
**Senha:** 123456

**Email:** joao@email.com  
**Senha:** 123456

**Email:** ana@email.com  
**Senha:** 123456

**Email:** roberto@email.com  
**Senha:** 123456

## ✅ Após popular

1. Acesse o frontend: http://localhost:5173
2. Faça login com uma das contas acima
3. Explore os produtos, carrinho e funcionalidades!


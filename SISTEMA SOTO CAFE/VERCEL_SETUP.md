# 🚀 Guia de Configuração no Vercel

## 📋 Instruções Passo a Passo

**IMPORTANTE:** O projeto já possui um arquivo `vercel.json` que configura automaticamente o build. Você só precisa preencher os campos básicos abaixo:

### 1. **Project Name**
```
sotocafe
```

### 2. **Framework Preset**
```
Other
```
*(Selecione "Other" - o Vercel detectará automaticamente via vercel.json)*

### 3. **Root Directory**
```
SISTEMA SOTO CAFE
```
*(Certifique-se de que está exatamente assim, com espaços)*

### 4. **Build Command**
```
Deixe em branco ou remova
```
*(O vercel.json já configura isso automaticamente)*

### 5. **Output Directory**
```
Deixe em branco ou remova
```
*(O vercel.json já configura isso automaticamente)*

### 6. **Install Command**
```
Deixe em branco ou remova
```
*(O Vercel detectará automaticamente os package.json em backend/ e frontend/)*

---

## 🔐 Variáveis de Ambiente (Environment Variables)

Adicione as seguintes variáveis de ambiente no Vercel:

### Variáveis Obrigatórias:

| Key | Value | Descrição |
|-----|-------|-----------|
| `NODE_ENV` | `production` | Ambiente de produção |
| `JWT_SECRET` | *(gere um valor aleatório)* | **⚠️ OBRIGATÓRIO!** Use o comando abaixo para gerar |
| `JWT_EXPIRES_IN` | `7d` | Tempo de expiração do token JWT |
| `CORS_ORIGIN` | *(sua URL do Vercel)* | **⚠️ OBRIGATÓRIO!** Ex: `https://sotocafe-xxxxx.vercel.app` |
| `VITE_API_URL` | *(sua URL do Vercel + /api)* | **⚠️ OBRIGATÓRIO!** Ex: `https://sotocafe-xxxxx.vercel.app/api` |

**Nota:** `PORT` não é necessário - o Vercel define automaticamente.

### Variáveis Opcionais:

| Key | Value | Descrição |
|-----|-------|-----------|
| `RATE_LIMIT_WINDOW_MS` | `900000` | Janela de rate limiting (15 minutos) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Máximo de requisições por janela |

---

## 📝 Como Adicionar Variáveis de Ambiente no Vercel:

1. Após criar o projeto, vá em **Settings** → **Environment Variables**
2. Clique em **Add New**
3. Adicione cada variável uma por uma:
   - **Key**: Nome da variável (ex: `JWT_SECRET`)
   - **Value**: Valor da variável
   - **Environment**: Selecione **Production**, **Preview** e **Development**
4. Clique em **Save**

---

## ⚠️ Importante:

1. **JWT_SECRET**: Gere um valor aleatório seguro. Você pode usar:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **CORS_ORIGIN**: Após o primeiro deploy, o Vercel fornecerá uma URL como `https://sotocafe-xxxxx.vercel.app`. Atualize a variável `CORS_ORIGIN` com essa URL.

3. **SQLite no Vercel**: O SQLite funciona no Vercel, mas os dados serão temporários (resetados a cada deploy). Para produção, considere usar um banco de dados hospedado (PostgreSQL, MySQL, etc.).

---

## 🔄 Após o Deploy:

1. Acesse a URL fornecida pelo Vercel
2. Acesse `/popular-banco` para popular o banco de dados
3. Faça login com as credenciais:
   - **Admin**: `admin@sotocafe.com` / `123456`
   - **Cliente**: `joao@email.com` / `123456`

---

## 🐛 Troubleshooting:

### Erro de Build:
- Verifique se todas as dependências estão instaladas
- Verifique os logs de build no Vercel

### Erro 500 na API:
- Verifique se as variáveis de ambiente estão configuradas
- Verifique os logs de runtime no Vercel

### CORS Error:
- Atualize `CORS_ORIGIN` com a URL correta do Vercel

---

**Boa sorte com o deploy! 🚀**


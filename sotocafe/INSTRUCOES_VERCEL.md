# 🚀 Instruções Rápidas para Vercel

## 📋 Preencha no Vercel:

### Campos Obrigatórios:

1. **Project Name**: `sotocafe`

2. **Framework Preset**: `Other` (ou deixe em branco)

3. **Root Directory**: `sotocafe`

4. **Build Command**: *(DEIXE EM BRANCO)* - O `vercel.json` já configura

5. **Output Directory**: *(DEIXE EM BRANCO)* - O `vercel.json` já configura

6. **Install Command**: *(DEIXE EM BRANCO)* - O Vercel detecta automaticamente

---

## 🔐 Variáveis de Ambiente (IMPORTANTE!)

**Após criar o projeto, vá em Settings → Environment Variables e adicione:**

### 1. Gere o JWT_SECRET primeiro:
Execute no terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copie o valor gerado.

### 2. Adicione as variáveis:

| Key | Value | Quando adicionar |
|-----|-------|------------------|
| `NODE_ENV` | `production` | Agora |
| `JWT_SECRET` | *(valor gerado acima)* | Agora |
| `JWT_EXPIRES_IN` | `7d` | Agora |
| `CORS_ORIGIN` | *(aguarde o deploy)* | **DEPOIS do primeiro deploy** |
| `VITE_API_URL` | *(aguarde o deploy)* | **DEPOIS do primeiro deploy** |

### 3. Após o primeiro deploy:

1. O Vercel fornecerá uma URL como: `https://sotocafe-xxxxx.vercel.app`
2. Volte em **Settings → Environment Variables**
3. Adicione/Atualize:
   - `CORS_ORIGIN` = `https://sotocafe-xxxxx.vercel.app`
   - `VITE_API_URL` = `https://sotocafe-xxxxx.vercel.app/api`
4. Faça um novo deploy (ou aguarde o redeploy automático)

---

## ✅ Resumo:

1. ✅ Preencha: Project Name, Root Directory
2. ✅ Selecione: Framework Preset = Other
3. ✅ Deixe em branco: Build Command, Output Directory, Install Command
4. ✅ Adicione variáveis: NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN
5. ✅ Faça o deploy
6. ✅ Após o deploy, adicione: CORS_ORIGIN e VITE_API_URL
7. ✅ Acesse `/popular-banco` para popular o banco

---

**Pronto! 🎉**


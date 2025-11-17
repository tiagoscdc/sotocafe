// Este arquivo é um proxy para o backend
// O Vercel usa este arquivo como entry point para as funções serverless
// Importar o app do backend (o Vercel compila automaticamente)
import app from '../backend/src/server';

// Exportar como handler do Vercel
export default app;


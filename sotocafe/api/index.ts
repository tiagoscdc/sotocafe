// Este arquivo é um proxy para o backend
// O Vercel usa este arquivo como entry point para as funções serverless
// Importar o app do backend compilado
import app from '../backend/dist/server.js';

// Exportar como handler do Vercel
export default app;


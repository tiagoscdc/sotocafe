// Este arquivo é um proxy para o backend
// O Vercel usa este arquivo como entry point para as funções serverless
// Importar o app do backend (o Vercel compila automaticamente)
import app from '../backend/src/server';
import { initDatabase } from '../backend/src/utils/initDatabase';
import sequelize from '../backend/src/config/database';

// No Vercel, inicializar banco na primeira requisição
let dbInitialized = false;
let dbInitializing = false;

const initializeDbOnce = async () => {
  if (dbInitialized || dbInitializing) return;
  
  dbInitializing = true;
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida no Vercel');
    const success = await initDatabase();
    if (success) {
      dbInitialized = true;
      console.log('✅ Banco inicializado com sucesso no Vercel');
    } else {
      console.warn('⚠️ Falha ao inicializar banco no Vercel');
    }
  } catch (error: any) {
    console.error('❌ Erro ao inicializar banco no Vercel:', error.message);
    console.error('Stack:', error.stack);
    // Continuar mesmo com erro
  } finally {
    dbInitializing = false;
  }
};

// Inicializar em background (não bloquear)
initializeDbOnce().catch((error) => {
  console.error('Erro na inicialização do banco:', error);
});

// Exportar como handler do Vercel
export default app;


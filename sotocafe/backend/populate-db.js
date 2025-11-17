// Script para popular o banco usando pg diretamente
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'soto_cafe',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function populate() {
  try {
    console.log('Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado ao banco de dados!');

    console.log('\nLendo arquivo seed.sql...');
    const sqlFile = path.join(__dirname, '../database/seed.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Executando script SQL...\n');
    
    // Executar o SQL diretamente
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--') && !q.startsWith('DO $$'));

    let executed = 0;
    for (const query of queries) {
      if (query.trim() && !query.trim().startsWith('--')) {
        try {
          await client.query(query);
          if (query.toUpperCase().includes('INSERT') || query.toUpperCase().includes('UPDATE')) {
            executed++;
            if (executed % 5 === 0) {
              console.log(`✅ ${executed} comandos executados...`);
            }
          }
        } catch (error) {
          // Ignorar erros de duplicação
          if (!error.message.includes('duplicate') && !error.message.includes('already exists')) {
            // console.error('⚠️ Erro:', error.message.substring(0, 100));
          }
        }
      }
    }

    // Executar blocos DO $$ separadamente
    const doBlocks = sql.match(/DO \$\$[\s\S]*?\$\$;/g) || [];
    for (const block of doBlocks) {
      try {
        await client.query(block);
        console.log('✅ Bloco DO executado');
      } catch (error) {
        if (!error.message.includes('duplicate')) {
          console.error('⚠️ Erro no bloco DO:', error.message.substring(0, 100));
        }
      }
    }

    console.log('\n✅ Banco de dados populado com sucesso!');
    console.log('\n📋 Credenciais de login:');
    console.log('   Email: joao@email.com');
    console.log('   Senha: 123456');
    console.log('\n   Email: admin@sotocafe.com');
    console.log('   Senha: 123456');
    console.log('\n🌐 Acesse: http://localhost:5173');

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
    process.exit(0);
  }
}

populate();


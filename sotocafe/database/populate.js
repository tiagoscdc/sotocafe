// Script Node.js para popular o banco de dados
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

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
    const sqlFile = path.join(__dirname, 'seed.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Executando script SQL...\n');
    
    // Dividir o SQL em comandos individuais
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim() && !command.trim().startsWith('--')) {
        try {
          await client.query(command);
          if (command.toUpperCase().includes('INSERT') || command.toUpperCase().includes('UPDATE')) {
            console.log(`✅ Comando ${i + 1}/${commands.length} executado`);
          }
        } catch (error) {
          // Ignorar erros de duplicação (ON CONFLICT DO NOTHING)
          if (!error.message.includes('duplicate key') && !error.message.includes('already exists')) {
            console.error(`⚠️ Erro no comando ${i + 1}:`, error.message);
          }
        }
      }
    }

    console.log('\n✅ Banco de dados populado com sucesso!');
    console.log('\n📋 Credenciais de login:');
    console.log('   Email: joao@email.com');
    console.log('   Senha: 123456');
    console.log('\n   Email: admin@sotocafe.com');
    console.log('   Senha: 123456');

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

populate();


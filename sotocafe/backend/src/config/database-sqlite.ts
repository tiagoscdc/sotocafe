import Database, { type Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// No Vercel, usar /tmp que é writable. Em desenvolvimento, usar diretório local
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const dbDir = isVercel 
  ? '/tmp'  // Vercel permite escrita em /tmp
  : path.join(__dirname, '../../data');

// Criar diretório de dados se não existir (apenas em desenvolvimento)
if (!isVercel && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'soto_cafe.db');

console.log('📁 SQLite Database Path:', dbPath);
console.log('🌍 Environment:', isVercel ? 'Vercel/Production' : 'Development');

// Criar conexão SQLite
const db: DatabaseType = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Executar schema se necessário (apenas uma vez)
// O schema está na raiz do projeto, não em backend/database
const schemaPath = path.join(__dirname, '../../../database/schema-sqlite.sql');
if (fs.existsSync(schemaPath)) {
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    // Remover comentários e dividir em comandos
    const lines = schema.split('\n');
    const cleanLines = lines
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('--') && line !== '');
    
    let currentCommand = '';
    for (const line of cleanLines) {
      currentCommand += line + ' ';
      if (line.endsWith(';')) {
        const cmd = currentCommand.trim();
        if (cmd.length > 1) {
          try {
            db.exec(cmd);
          } catch (e: any) {
            // Ignorar erros de tabela já existe ou índice já existe
            if (!e.message.includes('already exists') && !e.message.includes('duplicate')) {
              // Silenciar avisos na inicialização
            }
          }
        }
        currentCommand = '';
      }
    }
    console.log('✅ Schema SQLite carregado');
  } catch (e: any) {
    console.error('❌ Erro ao executar schema:', e.message);
  }
} else {
  console.warn('⚠️ Arquivo schema-sqlite.sql não encontrado em:', schemaPath);
}

// Função para converter boolean para integer (SQLite)
const boolToInt = (value: any): any => {
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value === true) return 1;
  if (value === false) return 0;
  return value;
};

// Função para substituir placeholders
const replacePlaceholders = (sql: string, replacements: any): { query: string; params: any[] } => {
  let query = sql;
  const params: any[] = [];
  
  // Se replacements é um array, usar diretamente
  if (Array.isArray(replacements)) {
    return { query, params: replacements.map(v => boolToInt(v)) };
  }
  
  // Se é um objeto, substituir placeholders :nome
  const keys = Object.keys(replacements);
  keys.forEach((key) => {
    const placeholder = new RegExp(`:${key}\\b`, 'g');
    const value = boolToInt(replacements[key]);
    query = query.replace(placeholder, '?');
    params.push(value);
  });
  
  return { query, params };
};

// Wrapper para compatibilidade com Sequelize-style
const sequelize = {
  query: async (sql: string, options?: any) => {
    try {
      let query = sql;
      let params: any[] = [];
      
      if (options?.replacements) {
        const result = replacePlaceholders(sql, options.replacements);
        query = result.query;
        params = result.params;
      }
      
      // Converter booleanos em condições WHERE/INSERT/UPDATE
      query = query.replace(/\btrue\b/gi, '1').replace(/\bfalse\b/gi, '0');
      
      const upperQuery = query.trim().toUpperCase();
      
      if (upperQuery.startsWith('SELECT') || upperQuery.startsWith('WITH')) {
        const stmt = db.prepare(query);
        const results = params.length > 0 ? stmt.all(...params) : stmt.all();
        return [results];
      } else {
        const stmt = db.prepare(query);
        const result = params.length > 0 ? stmt.run(...params) : stmt.run();
        return [result];
      }
    } catch (error: any) {
      console.error('Erro SQL:', error.message);
      console.error('Query:', sql.substring(0, 200));
      throw error;
    }
  },
  authenticate: async () => {
    try {
      db.prepare('SELECT 1').get();
      return true;
    } catch (error) {
      throw error;
    }
  },
  close: async () => {
    db.close();
  },
  QueryTypes: {
    SELECT: 'SELECT',
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
  }
};

export default sequelize;
export { db };


// Script para popular o banco automaticamente via API
const http = require('http');

console.log('Aguardando backend iniciar...');
setTimeout(() => {
  console.log('Populando banco de dados...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/seed/populate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('\n✅ Banco populado com sucesso!');
          console.log('\n📋 Credenciais:');
          console.log('   Email: joao@email.com');
          console.log('   Senha: 123456');
          console.log('\n🌐 Acesse: http://localhost:5173');
        } else {
          console.log('❌ Erro:', result.message);
        }
      } catch (e) {
        console.log('Resposta:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Erro ao conectar:', error.message);
    console.log('   Certifique-se de que o backend está rodando na porta 3000');
  });

  req.end();
}, 10000); // Aguardar 10 segundos para o backend iniciar


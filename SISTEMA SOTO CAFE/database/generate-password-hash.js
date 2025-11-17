// Script para gerar hash de senha
const bcrypt = require('bcryptjs');

const senha = '123456';

bcrypt.hash(senha, 10, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('Senha:', senha);
  console.log('Hash:', hash);
  console.log('\nUse este hash no arquivo seed.sql');
});


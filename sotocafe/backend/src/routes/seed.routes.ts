import { Router, Request, Response } from 'express';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';
import { usuariosExpandidos, produtosExpandidos, enderecosExpandidos, cuponsExpandidos, gerarPedidosExemplo } from './seed-expanded';

const router = Router();

// Rota para verificar status do banco
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const [countUsuarios]: any = await sequelize.query('SELECT COUNT(*) as count FROM usuarios');
    const [countProdutos]: any = await sequelize.query('SELECT COUNT(*) as count FROM produtos');
    const [countCategorias]: any = await sequelize.query('SELECT COUNT(*) as count FROM categorias');
    const [countCupons]: any = await sequelize.query('SELECT COUNT(*) as count FROM cupons_desconto');
    const [countEnderecos]: any = await sequelize.query('SELECT COUNT(*) as count FROM enderecos');
    const [countPedidos]: any = await sequelize.query('SELECT COUNT(*) as count FROM pedidos');
    
    return res.json({
      success: true,
      data: {
        usuarios: countUsuarios[0]?.count || 0,
        produtos: countProdutos[0]?.count || 0,
        categorias: countCategorias[0]?.count || 0,
        cupons: countCupons[0]?.count || 0,
        enderecos: countEnderecos[0]?.count || 0,
        pedidos: countPedidos[0]?.count || 0
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar status',
      error: error.message
    });
  }
});

// Rota para popular o banco (apenas em desenvolvimento)
router.post('/populate', async (_req: Request, res: Response) => {
  try {
    console.log('📦 Iniciando população do banco...');
    
    // Verificar conexão
    try {
      await sequelize.authenticate();
      console.log('✅ Conexão com banco estabelecida');
    } catch (dbError: any) {
      console.error('❌ Erro de conexão:', dbError.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao conectar ao banco de dados SQLite.',
        error: dbError.message
      });
    }
    
    // Verificar se as tabelas existem, se não, executar schema
    try {
      await sequelize.query('SELECT 1 FROM usuarios LIMIT 1');
      console.log('✅ Tabelas já existem');
    } catch (e: any) {
      if (e.message.includes('no such table')) {
        console.log('📋 Tabelas não existem. Executando schema...');
        // Importar e executar schema
        const dbModule = await import('../config/database-sqlite.js');
        const db = dbModule.db;
        const fs = require('fs');
        const path = require('path');
        
        const schemaPath = path.join(__dirname, '../../../../database/schema-sqlite.sql');
        if (fs.existsSync(schemaPath)) {
          const schema = fs.readFileSync(schemaPath, 'utf8');
          const lines = schema.split('\n');
          const cleanLines = lines
            .map((line: string) => line.trim())
            .filter((line: string) => line && !line.startsWith('--') && line !== '');
          
          let currentCommand = '';
          for (const line of cleanLines) {
            currentCommand += line + ' ';
            if (line.endsWith(';')) {
              const cmd = currentCommand.trim();
              if (cmd.length > 1) {
                try {
                  db.exec(cmd);
                } catch (err: any) {
                  if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
                    console.warn('⚠️ Aviso:', err.message.substring(0, 100));
                  }
                }
              }
              currentCommand = '';
            }
          }
          console.log('✅ Schema executado com sucesso');
        } else {
          throw new Error('Arquivo schema-sqlite.sql não encontrado em: ' + schemaPath);
        }
      } else {
        throw e;
      }
    }
    
    // Gerar hash de senha
    console.log('🔐 Gerando hash de senha...');
    const senhaHash = await bcrypt.hash('123456', 10);

    // Limpar dados existentes (SQLite não suporta TRUNCATE CASCADE, usar DELETE)
    console.log('🧹 Limpando dados existentes...');
    try {
      // Desabilitar foreign keys temporariamente para permitir DELETE
      await sequelize.query('PRAGMA foreign_keys = OFF');
      
      await sequelize.query('DELETE FROM historico_status_pedido');
      await sequelize.query('DELETE FROM item_pedido');
      await sequelize.query('DELETE FROM pedidos');
      await sequelize.query('DELETE FROM item_carrinho');
      await sequelize.query('DELETE FROM carrinho');
      await sequelize.query('DELETE FROM historico_pontos');
      await sequelize.query('DELETE FROM programa_fidelidade');
      await sequelize.query('DELETE FROM imagens_produto');
      await sequelize.query('DELETE FROM produtos');
      await sequelize.query('DELETE FROM enderecos');
      await sequelize.query('DELETE FROM usuarios');
      
      // Reabilitar foreign keys
      await sequelize.query('PRAGMA foreign_keys = ON');
      
      // Manter categorias e configurações de frete (dados iniciais)
      console.log('✅ Dados existentes limpos');
    } catch (e: any) {
      // Reabilitar foreign keys em caso de erro
      try {
        await sequelize.query('PRAGMA foreign_keys = ON');
      } catch {}
      
      // Ignorar erros de tabela não existe (primeira execução)
      if (e.message?.includes('no such table')) {
        console.log('⚠️ Algumas tabelas não existem ainda, continuando...');
      } else {
        console.error('⚠️ Erro ao limpar dados existentes:', e.message);
        // Continuar mesmo com erro (pode ser que não precise limpar)
      }
    }

    // 1. Usuários (SQLite usa 1 para true, 0 para false)
    console.log('👤 Inserindo usuários...');
    for (const usuario of usuariosExpandidos) {
      try {
        await sequelize.query(
          `INSERT OR IGNORE INTO usuarios (nome, email, senha_hash, telefone, tipo_usuario, status, email_verificado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          { replacements: [usuario[0], usuario[1], senhaHash, usuario[2], usuario[3], 'Ativo', 1] }
        );
      } catch (e: any) {
        // Ignorar erros de duplicação
        if (!e.message?.includes('UNIQUE constraint') && !e.message?.includes('duplicate')) {
          console.warn('⚠️ Erro ao inserir usuário:', usuario[1], e.message);
        }
      }
    }

    // 2. Categorias (verificar se já existem)
    console.log('📂 Verificando categorias...');
    const [categoriasExistentes]: any = await sequelize.query('SELECT COUNT(*) as count FROM categorias');
    const count = categoriasExistentes[0]?.count || 0;
    
    if (count === 0) {
      console.log('📂 Inserindo categorias...');
      const categoriasData = [
        ['Cafés em Grão', 'cafes-grao', 'Cafés especiais em grão', 1, 1],
        ['Cafés Moídos', 'cafes-moidos', 'Cafés já moídos', 2, 1],
        ['Cápsulas', 'capsulas', 'Cápsulas compatíveis', 3, 1],
        ['Acessórios', 'acessorios', 'Xícaras e acessórios', 4, 1],
        ['Kits', 'kits', 'Kits especiais', 5, 1]
      ];
      
      for (const cat of categoriasData) {
        await sequelize.query(
          `INSERT INTO categorias (nome_categoria, slug, descricao, ordem_exibicao, ativo) VALUES (?, ?, ?, ?, ?)`,
          { replacements: cat }
        );
      }
      console.log('✅ Categorias inseridas');
    } else {
      console.log(`✅ ${count} categorias já existem`);
    }

    // 3. Produtos
    console.log('📦 Inserindo produtos...');
    const [categorias]: any = await sequelize.query('SELECT id_categoria, slug FROM categorias');
    
    if (!categorias || categorias.length === 0) {
      throw new Error('Nenhuma categoria encontrada. Certifique-se de que as categorias foram inseridas.');
    }
    
    const catGrao = categorias.find((c: any) => c.slug === 'cafes-grao');
    const catMoido = categorias.find((c: any) => c.slug === 'cafes-moidos');
    const catCapsula = categorias.find((c: any) => c.slug === 'capsulas');
    const catAcessorio = categorias.find((c: any) => c.slug === 'acessorios');
    const catKits = categorias.find((c: any) => c.slug === 'kits');
    
    if (!catGrao || !catMoido || !catCapsula || !catAcessorio || !catKits) {
      throw new Error('Algumas categorias não foram encontradas. Categorias disponíveis: ' + categorias.map((c: any) => c.slug).join(', '));
    }

    // Inserir produtos expandidos
    const produtosParaInserir = produtosExpandidos(catGrao.id_categoria, catMoido.id_categoria, catCapsula.id_categoria, catAcessorio.id_categoria, catKits.id_categoria);
    
    for (const produto of produtosParaInserir) {
      await sequelize.query(
        `INSERT OR IGNORE INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, peso_gramas, ativo, destaque, origem, nivel_torra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        { replacements: produto }
      );
    }

    // 4. Imagens dos produtos
    console.log('🖼️ Inserindo imagens...');
    const [produtosInseridos]: any = await sequelize.query('SELECT id_produto, slug FROM produtos');
    for (const produto of produtosInseridos) {
      await sequelize.query(
        `INSERT OR IGNORE INTO imagens_produto (id_produto, url_imagem, ordem, principal, alt_text) VALUES (?, ?, ?, ?, ?)`,
        { replacements: [produto.id_produto, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800', 1, 1, produto.slug] }
      );
    }

    // 5. Endereços
    console.log('📍 Inserindo endereços...');
    for (const endereco of enderecosExpandidos) {
      const [usuarios]: any = await sequelize.query("SELECT id_usuario FROM usuarios WHERE email = ?", {
        replacements: [endereco[0]],
        type: sequelize.QueryTypes.SELECT
      });
      if (usuarios && usuarios.length > 0) {
        await sequelize.query(
          `INSERT OR IGNORE INTO enderecos (id_usuario, tipo_endereco, cep, rua, numero, complemento, bairro, cidade, estado, endereco_principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          { replacements: [usuarios[0].id_usuario, endereco[1], endereco[2], endereco[3], endereco[4], endereco[5], endereco[6], endereco[7], endereco[8], endereco[9]] }
        );
      }
    }

    // 6. Programa de fidelidade
    console.log('🎁 Inserindo programa de fidelidade...');
    const [todosUsuarios]: any = await sequelize.query("SELECT id_usuario FROM usuarios");
    for (const usuario of todosUsuarios) {
      await sequelize.query(
        `INSERT OR IGNORE INTO programa_fidelidade (id_usuario, saldo_pontos, pontos_totais_ganhos) VALUES (?, ?, ?)`,
        { replacements: [usuario.id_usuario, 150, 500] }
      );
    }

    // 7. Cupons
    console.log('🎫 Inserindo cupons...');
    for (const cupom of cuponsExpandidos) {
      await sequelize.query(
        `INSERT OR IGNORE INTO cupons_desconto (codigo_cupom, tipo_desconto, valor_desconto, data_inicio, data_fim, valor_minimo_pedido, ativo) VALUES (?, ?, ?, date('now'), date('now', '+90 days'), ?, ?)`,
        { replacements: [cupom[0], cupom[1], cupom[2], cupom[3], cupom[4], cupom[5]] }
      );
    }

    // 8. Pedidos de exemplo
    console.log('📦 Inserindo pedidos de exemplo...');
    try {
      const pedidosExemplo = await gerarPedidosExemplo(sequelize);
      
      for (const pedido of pedidosExemplo) {
        // Inserir pedido
        await sequelize.query(
          `INSERT OR IGNORE INTO pedidos (
            id_cliente, id_endereco_entrega, numero_pedido, data_pedido, metodo_pagamento,
            status_pedido, status_pagamento, valor_subtotal, valor_desconto, valor_frete, valor_total, id_cupom
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          {
            replacements: [
              pedido.cliente,
              pedido.endereco,
              pedido.numeroPedido,
              pedido.dataPedido,
              pedido.metodoPagamento,
              pedido.statusPedido,
              pedido.statusPagamento,
              pedido.valorSubtotal,
              pedido.valorDesconto,
              pedido.valorFrete,
              pedido.valorTotal,
              pedido.idCupom
            ]
          }
        );

        // Buscar ID do pedido criado
        const [pedidoCriadoArray]: any = await sequelize.query(
          'SELECT id_pedido FROM pedidos WHERE numero_pedido = ?',
          {
            replacements: [pedido.numeroPedido],
            type: sequelize.QueryTypes.SELECT
          }
        );

        const pedidoId = Array.isArray(pedidoCriadoArray) && pedidoCriadoArray.length > 0 
          ? pedidoCriadoArray[0].id_pedido 
          : null;

        if (pedidoId) {
          // Inserir itens do pedido
          for (const item of pedido.itens) {
            const [produtoArray]: any = await sequelize.query(
              'SELECT preco_unitario FROM produtos WHERE id_produto = ?',
              {
                replacements: [item.id_produto],
                type: sequelize.QueryTypes.SELECT
              }
            );

            const produto = Array.isArray(produtoArray) && produtoArray.length > 0 ? produtoArray[0] : null;
            if (produto) {
              const subtotal = Number(produto.preco_unitario) * item.quantidade;
              await sequelize.query(
                `INSERT OR IGNORE INTO item_pedido (
                  id_pedido, id_produto, quantidade, preco_unitario_no_pedido, subtotal
                ) VALUES (?, ?, ?, ?, ?)`,
                {
                  replacements: [
                    pedidoId,
                    item.id_produto,
                    item.quantidade,
                    produto.preco_unitario,
                    subtotal
                  ]
                }
              );
            }
          }
        }
      }
      console.log(`✅ ${pedidosExemplo.length} pedidos inseridos`);
    } catch (pedidoError: any) {
      console.warn('⚠️ Erro ao inserir pedidos (continuando...):', pedidoError.message);
    }
    
    console.log('✅ Banco populado com sucesso!');

    // Contar registros inseridos
    const [countUsuarios]: any = await sequelize.query('SELECT COUNT(*) as count FROM usuarios');
    const [countProdutos]: any = await sequelize.query('SELECT COUNT(*) as count FROM produtos');
    const [countCupons]: any = await sequelize.query('SELECT COUNT(*) as count FROM cupons_desconto');
    const [countEnderecos]: any = await sequelize.query('SELECT COUNT(*) as count FROM enderecos');
    const [countPedidos]: any = await sequelize.query('SELECT COUNT(*) as count FROM pedidos');
    
    return res.json({
      success: true,
      message: 'Banco de dados populado com sucesso!',
      data: {
        usuarios: countUsuarios[0]?.count || 0,
        categorias: 5,
        produtos: countProdutos[0]?.count || 0,
        cupons: countCupons[0]?.count || 0,
        enderecos: countEnderecos[0]?.count || 0,
        pedidos: countPedidos[0]?.count || 0
      }
    });
  } catch (error: any) {
    console.error('❌ Erro ao popular banco:', error);
    console.error('Stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
    
    // Verificar se é erro de permissão de escrita (comum no Vercel)
    if (error.message?.includes('readonly') || error.message?.includes('EACCES') || error.code === 'EACCES') {
      return res.status(500).json({
        success: false,
        message: 'Erro de permissão: O sistema de arquivos pode ser somente leitura. No Vercel, o SQLite tem limitações. Considere usar um banco de dados hospedado para produção.',
        error: 'SQLite read-only filesystem error',
        instrucoes: [
          'O SQLite no Vercel pode ter limitações de escrita',
          'Para produção, considere usar PostgreSQL, MySQL ou outro banco hospedado',
          'Os dados podem ser temporários e resetados a cada deploy'
        ]
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao popular banco de dados',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;


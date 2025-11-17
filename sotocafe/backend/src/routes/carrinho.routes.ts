import { Router, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Obter carrinho
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Buscar ou criar carrinho
    const [carrinhosArray]: any = await sequelize.query(
      `SELECT * FROM carrinho WHERE id_usuario = ? 
       ORDER BY data_criacao DESC LIMIT 1`,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    let carrinho = Array.isArray(carrinhosArray) && carrinhosArray.length > 0 ? carrinhosArray[0] : null;

    if (!carrinho) {
      // Criar novo carrinho
      await sequelize.query(
        `INSERT INTO carrinho (id_usuario) VALUES (?)`,
        {
          replacements: [userId],
          type: sequelize.QueryTypes.INSERT
        }
      );
      // Buscar o carrinho recém-criado
      const [newCarrinhosArray]: any = await sequelize.query(
        `SELECT * FROM carrinho WHERE id_usuario = ? ORDER BY data_criacao DESC LIMIT 1`,
        {
          replacements: [userId],
          type: sequelize.QueryTypes.SELECT
        }
      );
      carrinho = Array.isArray(newCarrinhosArray) && newCarrinhosArray.length > 0 ? newCarrinhosArray[0] : null;
      
      // Se ainda não tiver carrinho, retornar erro
      if (!carrinho || !carrinho.id_carrinho) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao criar carrinho'
        });
      }
    }

    // Buscar itens do carrinho (garantir que carrinho.id_carrinho existe)
    let itens: any[] = [];
    try {
      // Tentar buscar itens diretamente - se não houver itens, retornará array vazio
      const [itensArray]: any = await sequelize.query(
        `SELECT 
          ic.id_item_carrinho,
          ic.id_carrinho,
          ic.id_produto,
          ic.quantidade,
          ic.data_adicao,
          p.nome_produto,
          p.slug,
          p.preco_unitario,
          p.estoque_atual,
          p.peso_gramas,
          (SELECT url_imagem FROM imagens_produto 
           WHERE id_produto = p.id_produto AND principal = 1 
           LIMIT 1) as imagem
        FROM item_carrinho ic
        INNER JOIN produtos p ON ic.id_produto = p.id_produto
        WHERE ic.id_carrinho = ? AND p.ativo = 1`,
        {
          replacements: [carrinho.id_carrinho],
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      itens = Array.isArray(itensArray) ? itensArray : [];
    } catch (itensError: any) {
      // Se der erro ao buscar itens (pode ser que não existam itens ainda ou tabela não existe), retornar array vazio
      if (itensError.message?.includes('no such table')) {
        console.warn('⚠️ Tabela item_carrinho não existe ainda. Banco pode precisar ser populado.');
      } else {
        console.warn('⚠️ Erro ao buscar itens do carrinho (pode ser normal se carrinho estiver vazio):', itensError.message);
      }
      itens = [];
    }

    return res.json({
      success: true,
      data: {
        ...carrinho,
        itens
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar carrinho:', error);
    console.error('Stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      path: error.path,
      userId: req.user?.id
    });
    
    // Verificar se é erro de tabela não existe
    if (error.message?.includes('no such table')) {
      return res.status(500).json({
        success: false,
        message: 'Banco de dados não inicializado. Acesse /api/seed/populate para popular o banco.',
        error: 'Database not initialized'
      });
    }
    
    // Verificar se é erro de permissão de escrita (comum no Vercel)
    if (error.message?.includes('readonly') || error.message?.includes('EACCES') || error.code === 'EACCES' || error.code === 'EROFS') {
      return res.status(500).json({
        success: false,
        message: 'Erro de permissão: O sistema de arquivos pode ser somente leitura. No Vercel, o SQLite tem limitações.',
        error: 'SQLite read-only filesystem error',
        instrucoes: [
          'O SQLite no Vercel pode ter limitações de escrita',
          'Os dados podem ser temporários e resetados a cada deploy',
          'Para produção, considere usar um banco de dados hospedado'
        ]
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar carrinho',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
});

// Adicionar item ao carrinho
router.post('/itens', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id_produto, quantidade } = req.body;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }
  
  try {
    if (!id_produto || !quantidade || quantidade <= 0) {
      return res.status(400).json({
        success: false,
        message: 'id_produto e quantidade são obrigatórios'
      });
    }

    // Verificar produto
    const [produtosArray]: any = await sequelize.query(
      'SELECT id_produto, estoque_atual FROM produtos WHERE id_produto = ? AND ativo = 1',
      {
        replacements: [id_produto],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    const produto = Array.isArray(produtosArray) && produtosArray.length > 0 ? produtosArray[0] : null;

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    if (produto.estoque_atual < quantidade) {
      return res.status(400).json({
        success: false,
        message: 'Estoque insuficiente'
      });
    }

    // Buscar ou criar carrinho
    const [carrinhosArray2]: any = await sequelize.query(
      `SELECT * FROM carrinho WHERE id_usuario = ? 
       ORDER BY data_criacao DESC LIMIT 1`,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    let carrinho = Array.isArray(carrinhosArray2) && carrinhosArray2.length > 0 ? carrinhosArray2[0] : null;

    if (!carrinho) {
      await sequelize.query(
        `INSERT INTO carrinho (id_usuario) VALUES (?)`,
        {
          replacements: [userId],
          type: sequelize.QueryTypes.INSERT
        }
      );
      const [newCarrinhosArray2]: any = await sequelize.query(
        `SELECT * FROM carrinho WHERE id_usuario = ? ORDER BY data_criacao DESC LIMIT 1`,
        {
          replacements: [userId],
          type: sequelize.QueryTypes.SELECT
        }
      );
      carrinho = Array.isArray(newCarrinhosArray2) && newCarrinhosArray2.length > 0 ? newCarrinhosArray2[0] : null;
      
      if (!carrinho || !carrinho.id_carrinho) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao criar carrinho'
        });
      }
    }

    // Verificar se item já existe no carrinho
    const [itensExistentesArray]: any = await sequelize.query(
      'SELECT * FROM item_carrinho WHERE id_carrinho = ? AND id_produto = ?',
      {
        replacements: [carrinho.id_carrinho, id_produto],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    const itemExistente = Array.isArray(itensExistentesArray) && itensExistentesArray.length > 0 ? itensExistentesArray[0] : null;

    if (itemExistente) {
      // Atualizar quantidade
      await sequelize.query(
        'UPDATE item_carrinho SET quantidade = quantidade + ? WHERE id_item_carrinho = ?',
        {
          replacements: [quantidade, itemExistente.id_item_carrinho],
          type: sequelize.QueryTypes.UPDATE
        }
      );
    } else {
      // Adicionar novo item
      await sequelize.query(
        'INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade) VALUES (?, ?, ?)',
        {
          replacements: [carrinho.id_carrinho, id_produto, quantidade],
          type: sequelize.QueryTypes.INSERT
        }
      );
    }

    return res.json({
      success: true,
      message: 'Item adicionado ao carrinho'
    });
  } catch (error: any) {
    console.error('Erro ao adicionar item:', error);
    console.error('Stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      path: error.path,
      userId: userId,
      id_produto: id_produto,
      quantidade: quantidade
    });
    
    // Verificar se é erro de tabela não existe
    if (error.message?.includes('no such table')) {
      return res.status(500).json({
        success: false,
        message: 'Banco de dados não inicializado. Acesse /api/seed/populate para popular o banco.',
        error: 'Database not initialized'
      });
    }
    
    // Verificar se é erro de permissão de escrita (comum no Vercel)
    if (error.message?.includes('readonly') || error.message?.includes('EACCES') || error.code === 'EACCES' || error.code === 'EROFS') {
      return res.status(500).json({
        success: false,
        message: 'Erro de permissão: O sistema de arquivos pode ser somente leitura. No Vercel, o SQLite tem limitações.',
        error: 'SQLite read-only filesystem error',
        instrucoes: [
          'O SQLite no Vercel pode ter limitações de escrita',
          'Os dados podem ser temporários e resetados a cada deploy',
          'Para produção, considere usar um banco de dados hospedado'
        ]
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao adicionar item ao carrinho',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
});

// Remover item do carrinho
router.delete('/itens/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    await sequelize.query(
      `DELETE FROM item_carrinho 
       WHERE id_item_carrinho = ? 
       AND id_carrinho IN (SELECT id_carrinho FROM carrinho WHERE id_usuario = ?)`,
      {
        replacements: [id, userId],
        type: sequelize.QueryTypes.DELETE
      }
    );

    res.json({
      success: true,
      message: 'Item removido do carrinho'
    });
  } catch (error: any) {
    console.error('Erro ao remover item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover item do carrinho',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Limpar carrinho
router.delete('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    // Buscar carrinho do usuário
    const [carrinhosArray]: any = await sequelize.query(
      'SELECT id_carrinho FROM carrinho WHERE id_usuario = ?',
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (carrinhosArray && Array.isArray(carrinhosArray) && carrinhosArray.length > 0) {
      const carrinhoId = carrinhosArray[0].id_carrinho;
      
      // Deletar itens do carrinho
      await sequelize.query(
        'DELETE FROM item_carrinho WHERE id_carrinho = ?',
        {
          replacements: [carrinhoId],
          type: sequelize.QueryTypes.DELETE
        }
      );
      
      // Também deletar o carrinho (opcional, mas ajuda a garantir limpeza)
      try {
        await sequelize.query(
          'DELETE FROM carrinho WHERE id_carrinho = ?',
          {
            replacements: [carrinhoId],
            type: sequelize.QueryTypes.DELETE
          }
        );
      } catch (e) {
        // Ignorar erro se não conseguir deletar o carrinho
        console.warn('Aviso: não foi possível deletar o carrinho:', e);
      }
    }

    return res.json({
      success: true,
      message: 'Carrinho limpo'
    });
  } catch (error: any) {
    console.error('Erro ao limpar carrinho:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao limpar carrinho',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


import { Router, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Obter carrinho
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

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
    const [itensArray]: any = await sequelize.query(
      `SELECT 
        ic.*,
        p.nome_produto,
        p.slug,
        p.preco_unitario,
        p.estoque_atual,
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
    
    const itens = Array.isArray(itensArray) ? itensArray : [];

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
      userId: req.user?.id
    });
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar carrinho',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Adicionar item ao carrinho
router.post('/itens', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id_produto, quantidade } = req.body;
  
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
      userId: userId,
      id_produto: id_produto,
      quantidade: quantidade
    });
    return res.status(500).json({
      success: false,
      message: 'Erro ao adicionar item ao carrinho',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    await sequelize.query(
      `DELETE FROM item_carrinho 
       WHERE id_carrinho IN (SELECT id_carrinho FROM carrinho WHERE id_usuario = ?)`,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.DELETE
      }
    );

    res.json({
      success: true,
      message: 'Carrinho limpo'
    });
  } catch (error: any) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao limpar carrinho',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


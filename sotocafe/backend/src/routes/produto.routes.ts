import { Router, Request, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Listar produtos (público)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoria, busca, destaque, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT 
        p.id_produto,
        p.nome_produto,
        p.descricao_curta,
        p.slug,
        p.sku,
        p.preco_unitario,
        p.estoque_atual,
        p.ativo,
        p.destaque,
        p.origem,
        p.nivel_torra,
        c.nome_categoria,
        c.slug as categoria_slug,
        (SELECT url_imagem FROM imagens_produto 
         WHERE id_produto = p.id_produto AND principal = 1 
         LIMIT 1) as imagem_principal
      FROM produtos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.ativo = 1
    `;

    const replacements: any[] = [];

    if (categoria) {
      query += ' AND c.slug = ?';
      replacements.push(categoria);
    }

    if (busca) {
      query += ' AND (p.nome_produto LIKE ? OR p.descricao_curta LIKE ?)';
      replacements.push(`%${busca}%`);
      replacements.push(`%${busca}%`);
    }

    if (destaque === 'true') {
      query += ' AND p.destaque = 1';
    }

    query += ' ORDER BY p.data_cadastro DESC LIMIT ? OFFSET ?';
    replacements.push(Number(limit));
    replacements.push(offset);

    const [produtosResult]: any = await sequelize.query(query, {
      replacements: replacements.length > 0 ? replacements : undefined,
      type: sequelize.QueryTypes.SELECT
    });
    
    // SQLite retorna array dentro de array
    const produtos = Array.isArray(produtosResult) ? produtosResult : [];

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM produtos p INNER JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.ativo = 1';
    const countReplacements: any[] = [];

    if (categoria) {
      countQuery += ' AND c.slug = ?';
      countReplacements.push(categoria);
    }

    if (busca) {
      countQuery += ' AND (p.nome_produto LIKE ? OR p.descricao_curta LIKE ?)';
      countReplacements.push(`%${busca}%`);
      countReplacements.push(`%${busca}%`);
    }

    if (destaque === 'true') {
      countQuery += ' AND p.destaque = 1';
    }

    const [countResultArray]: any = await sequelize.query(countQuery, {
      replacements: countReplacements.length > 0 ? countReplacements : undefined,
      type: sequelize.QueryTypes.SELECT
    });
    
    const countResult = Array.isArray(countResultArray) && countResultArray.length > 0 ? countResultArray[0] : { total: 0 };

    return res.json({
      success: true,
      data: produtos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(countResult.total),
        totalPages: Math.ceil(Number(countResult.total) / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Erro ao listar produtos:', error);
    console.error('Stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
    
    // Verificar se é erro de tabela não existe
    if (error.message?.includes('no such table')) {
      return res.status(500).json({
        success: false,
        message: 'Banco de dados não inicializado. Acesse /api/seed/populate para popular o banco.',
        error: 'Database not initialized'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar produtos',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
});

// Obter produto por ID ou slug
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    let query = `
      SELECT 
        p.*,
        c.nome_categoria,
        c.slug as categoria_slug
      FROM produtos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.ativo = 1 AND ${isNumeric ? 'p.id_produto = ?' : 'p.slug = ?'}
    `;

    const [produtosArray]: any = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });
    
    const produto = Array.isArray(produtosArray) && produtosArray.length > 0 ? produtosArray[0] : null;

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Buscar imagens separadamente (mais confiável que GROUP_CONCAT)
    const [imagensArray]: any = await sequelize.query(
      'SELECT id_imagem, url_imagem, ordem, principal, alt_text FROM imagens_produto WHERE id_produto = ? ORDER BY ordem',
      {
        replacements: [produto.id_produto],
        type: sequelize.QueryTypes.SELECT
      }
    );
    produto.imagens = Array.isArray(imagensArray) ? imagensArray : [];
    
    // Adicionar imagem principal se não houver imagens
    if (produto.imagens.length === 0) {
      produto.imagem_principal = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800';
    } else {
      const principal = produto.imagens.find((img: any) => img.principal === 1);
      produto.imagem_principal = principal ? principal.url_imagem : produto.imagens[0].url_imagem;
    }

    return res.json({
      success: true,
      data: produto
    });
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Criar produto (admin)
router.post('/', authenticateToken, authorizeRoles('Administrador', 'Admin'), async (req: Request, res: Response) => {
  try {
    const {
      nome_produto,
      descricao,
      descricao_curta,
      slug,
      sku,
      preco_unitario,
      id_categoria,
      estoque_atual,
      peso_gramas
    } = req.body;

    if (!nome_produto || !slug || !sku || !preco_unitario || !id_categoria) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome_produto, slug, sku, preco_unitario, id_categoria'
      });
    }

    await sequelize.query(
      `INSERT INTO produtos (
        nome_produto, descricao, descricao_curta, slug, sku, preco_unitario,
        id_categoria, estoque_atual, peso_gramas, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          nome_produto,
          descricao || null,
          descricao_curta || null,
          slug,
          sku,
          preco_unitario,
          id_categoria,
          estoque_atual || 0,
          peso_gramas || 0,
          1 // ativo
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Buscar produto recém-criado
    const [result]: any = await sequelize.query(
      'SELECT * FROM produtos WHERE slug = ? ORDER BY data_cadastro DESC LIMIT 1',
      {
        replacements: [slug],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: Array.isArray(result) && result.length > 0 ? result[0] : null
    });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar produto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Atualizar produto (Admin)
router.put('/:id', authenticateToken, authorizeRoles('Administrador', 'Admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nome_produto,
      descricao,
      descricao_curta,
      slug,
      sku,
      preco_unitario,
      id_categoria,
      estoque_atual,
      peso_gramas,
      ativo,
      destaque
    } = req.body;

    // Verificar se produto existe
    const [produtoExistente]: any = await sequelize.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!produtoExistente || (Array.isArray(produtoExistente) && produtoExistente.length === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    await sequelize.query(
      `UPDATE produtos SET
        nome_produto = COALESCE(?, nome_produto),
        descricao = ?,
        descricao_curta = ?,
        slug = COALESCE(?, slug),
        sku = COALESCE(?, sku),
        preco_unitario = COALESCE(?, preco_unitario),
        id_categoria = COALESCE(?, id_categoria),
        estoque_atual = COALESCE(?, estoque_atual),
        peso_gramas = COALESCE(?, peso_gramas),
        ativo = COALESCE(?, ativo),
        destaque = COALESCE(?, destaque),
        data_atualizacao = CURRENT_TIMESTAMP
      WHERE id_produto = ?`,
      {
        replacements: [
          nome_produto,
          descricao !== undefined ? descricao : null,
          descricao_curta !== undefined ? descricao_curta : null,
          slug,
          sku,
          preco_unitario,
          id_categoria,
          estoque_atual,
          peso_gramas,
          ativo !== undefined ? (ativo ? 1 : 0) : null,
          destaque !== undefined ? (destaque ? 1 : 0) : null,
          id
        ],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Buscar produto atualizado
    const [produtoAtualizado]: any = await sequelize.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: Array.isArray(produtoAtualizado) && produtoAtualizado.length > 0 ? produtoAtualizado[0] : null
    });
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remover produto (Admin) - Soft delete (desativar)
router.delete('/:id', authenticateToken, authorizeRoles('Administrador', 'Admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se produto existe
    const [produtoExistente]: any = await sequelize.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!produtoExistente || (Array.isArray(produtoExistente) && produtoExistente.length === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Soft delete - desativar produto
    await sequelize.query(
      'UPDATE produtos SET ativo = 0, data_atualizacao = CURRENT_TIMESTAMP WHERE id_produto = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    return res.json({
      success: true,
      message: 'Produto removido (desativado) com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao remover produto:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao remover produto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


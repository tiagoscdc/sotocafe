import { Router, Request, Response } from 'express';
import sequelize from '../config/database';

const router = Router();

// Listar categorias (público)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [categoriasResult]: any = await sequelize.query(
      `SELECT 
        id_categoria,
        nome_categoria,
        slug,
        descricao,
        imagem,
        ordem_exibicao,
        (SELECT COUNT(*) FROM produtos WHERE id_categoria = c.id_categoria AND ativo = 1) as total_produtos
      FROM categorias c
      WHERE ativo = 1
      ORDER BY ordem_exibicao, nome_categoria`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    const categorias = Array.isArray(categoriasResult) ? categoriasResult : [];

    return res.json({
      success: true,
      data: categorias
    });
  } catch (error: any) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar categorias',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Obter categoria por slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [categoriasArray]: any = await sequelize.query(
      `SELECT * FROM categorias WHERE slug = ? AND ativo = 1`,
      {
        replacements: [slug],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    const categoria = Array.isArray(categoriasArray) && categoriasArray.length > 0 ? categoriasArray[0] : null;

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    return res.json({
      success: true,
      data: categoria
    });
  } catch (error: any) {
    console.error('Erro ao buscar categoria:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar categoria',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


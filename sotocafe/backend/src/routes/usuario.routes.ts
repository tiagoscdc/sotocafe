import { Router, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Obter endereços do usuário
router.get('/enderecos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const enderecos = await sequelize.query(
      'SELECT * FROM enderecos WHERE id_usuario = :userId ORDER BY endereco_principal DESC, data_cadastro DESC',
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.json({
      success: true,
      data: enderecos
    });
  } catch (error: any) {
    console.error('Erro ao buscar endereços:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar endereços',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Adicionar endereço
router.post('/enderecos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { cep, rua, numero, complemento, bairro, cidade, estado, tipo_endereco, endereco_principal } = req.body;

    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: cep, rua, numero, bairro, cidade, estado'
      });
    }

    // Se for principal, desmarcar outros
    if (endereco_principal) {
      await sequelize.query(
        'UPDATE enderecos SET endereco_principal = false WHERE id_usuario = :userId',
        {
          replacements: { userId },
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }

    const [result] = await sequelize.query(
      `INSERT INTO enderecos (
        id_usuario, cep, rua, numero, complemento, bairro, cidade, estado,
        tipo_endereco, endereco_principal
      ) VALUES (
        :userId, :cep, :rua, :numero, :complemento, :bairro, :cidade, :estado,
        :tipo_endereco, :endereco_principal
      ) RETURNING *`,
      {
        replacements: {
          userId,
          cep,
          rua,
          numero,
          complemento: complemento || null,
          bairro,
          cidade,
          estado,
          tipo_endereco: tipo_endereco || 'Residencial',
          endereco_principal: endereco_principal || false
        },
        type: sequelize.QueryTypes.INSERT
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Endereço adicionado com sucesso',
      data: result
    });
  } catch (error: any) {
    console.error('Erro ao adicionar endereço:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao adicionar endereço',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Obter programa de fidelidade
router.get('/fidelidade', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [fidelidade]: any = await sequelize.query(
      `SELECT 
        pf.*,
        (SELECT json_agg(json_build_object(
          'tipo', tipo_movimentacao,
          'pontos', pontos,
          'descricao', descricao,
          'data', data_movimentacao
        ) ORDER BY data_movimentacao DESC) 
        FROM historico_pontos 
        WHERE id_fidelidade = pf.id_fidelidade) as historico
      FROM programa_fidelidade pf
      WHERE pf.id_usuario = :userId`,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!fidelidade) {
      return res.status(404).json({
        success: false,
        message: 'Programa de fidelidade não encontrado'
      });
    }

    return res.json({
      success: true,
      data: fidelidade
    });
  } catch (error: any) {
    console.error('Erro ao buscar fidelidade:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar programa de fidelidade',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


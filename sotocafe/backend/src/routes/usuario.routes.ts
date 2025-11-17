import { Router, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Obter endereços do usuário
router.get('/enderecos', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [enderecosArray]: any = await sequelize.query(
      'SELECT * FROM enderecos WHERE id_usuario = ? ORDER BY endereco_principal DESC, data_cadastro DESC',
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    const enderecos = Array.isArray(enderecosArray) ? enderecosArray : [];

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
        'UPDATE enderecos SET endereco_principal = 0 WHERE id_usuario = ?',
        {
          replacements: [userId],
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }

    await sequelize.query(
      `INSERT INTO enderecos (
        id_usuario, cep, rua, numero, complemento, bairro, cidade, estado,
        tipo_endereco, endereco_principal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          userId,
          cep,
          rua,
          numero,
          complemento || null,
          bairro,
          cidade,
          estado,
          tipo_endereco || 'Residencial',
          endereco_principal ? 1 : 0
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );
    
    // Buscar endereço recém-criado
    const [result]: any = await sequelize.query(
      'SELECT * FROM enderecos WHERE id_usuario = ? ORDER BY data_cadastro DESC LIMIT 1',
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Endereço adicionado com sucesso',
      data: Array.isArray(result) && result.length > 0 ? result[0] : null
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

// Editar endereço
router.put('/enderecos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { cep, rua, numero, complemento, bairro, cidade, estado, tipo_endereco, endereco_principal } = req.body;

    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: cep, rua, numero, bairro, cidade, estado'
      });
    }

    // Verificar se o endereço pertence ao usuário
    const [enderecoExistente]: any = await sequelize.query(
      'SELECT * FROM enderecos WHERE id_endereco = ? AND id_usuario = ?',
      {
        replacements: [id, userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!enderecoExistente || (Array.isArray(enderecoExistente) && enderecoExistente.length === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado'
      });
    }

    // Se for principal, desmarcar outros
    if (endereco_principal) {
      await sequelize.query(
        'UPDATE enderecos SET endereco_principal = 0 WHERE id_usuario = ? AND id_endereco != ?',
        {
          replacements: [userId, id],
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }

    await sequelize.query(
      `UPDATE enderecos SET
        cep = ?, rua = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?,
        tipo_endereco = ?, endereco_principal = ?
      WHERE id_endereco = ? AND id_usuario = ?`,
      {
        replacements: [
          cep, rua, numero, complemento || null, bairro, cidade, estado,
          tipo_endereco || 'Residencial', endereco_principal ? 1 : 0,
          id, userId
        ],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Buscar endereço atualizado
    const [enderecoAtualizado]: any = await sequelize.query(
      'SELECT * FROM enderecos WHERE id_endereco = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.json({
      success: true,
      message: 'Endereço atualizado com sucesso',
      data: Array.isArray(enderecoAtualizado) && enderecoAtualizado.length > 0 ? enderecoAtualizado[0] : null
    });
  } catch (error: any) {
    console.error('Erro ao editar endereço:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao editar endereço',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remover endereço
router.delete('/enderecos/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Verificar se o endereço pertence ao usuário
    const [enderecoExistente]: any = await sequelize.query(
      'SELECT * FROM enderecos WHERE id_endereco = ? AND id_usuario = ?',
      {
        replacements: [id, userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!enderecoExistente || (Array.isArray(enderecoExistente) && enderecoExistente.length === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado'
      });
    }

    await sequelize.query(
      'DELETE FROM enderecos WHERE id_endereco = ? AND id_usuario = ?',
      {
        replacements: [id, userId],
        type: sequelize.QueryTypes.DELETE
      }
    );

    return res.json({
      success: true,
      message: 'Endereço removido com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao remover endereço:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao remover endereço',
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


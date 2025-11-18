import { Router, Request, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Listar cupons (Admin)
router.get('/', authenticateToken, authorizeRoles('Administrador', 'Admin'), async (req: Request, res: Response) => {
  try {
    const { ativo } = req.query;
    
    let query = 'SELECT * FROM cupons_desconto WHERE 1=1';
    const replacements: any[] = [];

    if (ativo !== undefined) {
      query += ' AND ativo = ?';
      replacements.push(ativo === 'true' ? 1 : 0);
    }

    query += ' ORDER BY data_criacao DESC';

    const [cuponsArray]: any = await sequelize.query(query, {
      replacements: replacements.length > 0 ? replacements : undefined,
      type: sequelize.QueryTypes.SELECT
    });

    const cupons = Array.isArray(cuponsArray) ? cuponsArray : [];

    return res.json({
      success: true,
      data: cupons
    });
  } catch (error: any) {
    console.error('Erro ao listar cupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar cupons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Obter cupom por código (público para validação)
router.get('/validar/:codigo', async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;

    // Buscar cupom (case-insensitive usando UPPER)
    // Usar datetime('now') para comparar com data/hora completa
    const [cuponsArray]: any = await sequelize.query(
      `SELECT * FROM cupons_desconto 
       WHERE UPPER(codigo_cupom) = UPPER(?) AND ativo = 1 
       AND DATE(data_inicio) <= DATE('now') 
       AND DATE(data_fim) >= DATE('now')`,
      {
        replacements: [codigo],
        type: sequelize.QueryTypes.SELECT
      }
    );

    const cupom = Array.isArray(cuponsArray) && cuponsArray.length > 0 ? cuponsArray[0] : null;

    if (!cupom) {
      return res.status(404).json({
        success: false,
        message: 'Cupom não encontrado ou inválido'
      });
    }

    // Verificar limite de usos
    if (cupom.limite_usos_total && cupom.usos_atuais >= cupom.limite_usos_total) {
      return res.status(400).json({
        success: false,
        message: 'Cupom esgotado'
      });
    }

    return res.json({
      success: true,
      data: cupom
    });
  } catch (error: any) {
    console.error('Erro ao validar cupom:', error);
    console.error('Código buscado:', req.params.codigo);
    return res.status(500).json({
      success: false,
      message: 'Erro ao validar cupom',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Criar cupom (Admin)
router.post('/', authenticateToken, authorizeRoles('Administrador', 'Admin'), async (req: Request, res: Response) => {
  try {
    const {
      codigo_cupom,
      tipo_desconto,
      valor_desconto,
      data_inicio,
      data_fim,
      limite_usos_total,
      limite_usos_por_cliente,
      valor_minimo_pedido,
      ativo
    } = req.body;

    if (!codigo_cupom || !tipo_desconto || !valor_desconto || !data_inicio || !data_fim) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: codigo_cupom, tipo_desconto, valor_desconto, data_inicio, data_fim'
      });
    }

    // Verificar se código já existe
    const [cupomExistente]: any = await sequelize.query(
      'SELECT * FROM cupons_desconto WHERE codigo_cupom = ?',
      {
        replacements: [codigo_cupom],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (cupomExistente && Array.isArray(cupomExistente) && cupomExistente.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Código de cupom já existe'
      });
    }

    await sequelize.query(
      `INSERT INTO cupons_desconto (
        codigo_cupom, tipo_desconto, valor_desconto, data_inicio, data_fim,
        limite_usos_total, limite_usos_por_cliente, valor_minimo_pedido, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          codigo_cupom,
          tipo_desconto,
          valor_desconto,
          data_inicio,
          data_fim,
          limite_usos_total || null,
          limite_usos_por_cliente || null,
          valor_minimo_pedido || 0,
          ativo !== undefined ? (ativo ? 1 : 0) : 1
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Buscar cupom recém-criado
    const [result]: any = await sequelize.query(
      'SELECT * FROM cupons_desconto WHERE codigo_cupom = ?',
      {
        replacements: [codigo_cupom],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Cupom criado com sucesso',
      data: Array.isArray(result) && result.length > 0 ? result[0] : null
    });
  } catch (error: any) {
    console.error('Erro ao criar cupom:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar cupom',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Atualizar cupom (Admin)
router.put('/:id', authenticateToken, authorizeRoles('Administrador', 'Admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      codigo_cupom,
      tipo_desconto,
      valor_desconto,
      data_inicio,
      data_fim,
      limite_usos_total,
      limite_usos_por_cliente,
      valor_minimo_pedido,
      ativo
    } = req.body;

    // Verificar se cupom existe
    const [cupomExistente]: any = await sequelize.query(
      'SELECT * FROM cupons_desconto WHERE id_cupom = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!cupomExistente || (Array.isArray(cupomExistente) && cupomExistente.length === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Cupom não encontrado'
      });
    }

    // Se mudou o código, verificar se já existe
    if (codigo_cupom && codigo_cupom !== cupomExistente[0]?.codigo_cupom) {
      const [codigoExistente]: any = await sequelize.query(
        'SELECT * FROM cupons_desconto WHERE codigo_cupom = ? AND id_cupom != ?',
        {
          replacements: [codigo_cupom, id],
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (codigoExistente && Array.isArray(codigoExistente) && codigoExistente.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Código de cupom já existe'
        });
      }
    }

    await sequelize.query(
      `UPDATE cupons_desconto SET
        codigo_cupom = COALESCE(?, codigo_cupom),
        tipo_desconto = COALESCE(?, tipo_desconto),
        valor_desconto = COALESCE(?, valor_desconto),
        data_inicio = COALESCE(?, data_inicio),
        data_fim = COALESCE(?, data_fim),
        limite_usos_total = ?,
        limite_usos_por_cliente = ?,
        valor_minimo_pedido = COALESCE(?, valor_minimo_pedido),
        ativo = COALESCE(?, ativo)
      WHERE id_cupom = ?`,
      {
        replacements: [
          codigo_cupom,
          tipo_desconto,
          valor_desconto,
          data_inicio,
          data_fim,
          limite_usos_total !== undefined ? limite_usos_total : null,
          limite_usos_por_cliente !== undefined ? limite_usos_por_cliente : null,
          valor_minimo_pedido,
          ativo !== undefined ? (ativo ? 1 : 0) : null,
          id
        ],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Buscar cupom atualizado
    const [cupomAtualizado]: any = await sequelize.query(
      'SELECT * FROM cupons_desconto WHERE id_cupom = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    return res.json({
      success: true,
      message: 'Cupom atualizado com sucesso',
      data: Array.isArray(cupomAtualizado) && cupomAtualizado.length > 0 ? cupomAtualizado[0] : null
    });
  } catch (error: any) {
    console.error('Erro ao atualizar cupom:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cupom',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Desativar cupom (Admin)
router.delete('/:id', authenticateToken, authorizeRoles('Administrador', 'Admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se cupom existe
    const [cupomExistente]: any = await sequelize.query(
      'SELECT * FROM cupons_desconto WHERE id_cupom = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!cupomExistente || (Array.isArray(cupomExistente) && cupomExistente.length === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Cupom não encontrado'
      });
    }

    // Desativar cupom
    await sequelize.query(
      'UPDATE cupons_desconto SET ativo = 0 WHERE id_cupom = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    return res.json({
      success: true,
      message: 'Cupom desativado com sucesso'
    });
  } catch (error: any) {
    console.error('Erro ao desativar cupom:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao desativar cupom',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


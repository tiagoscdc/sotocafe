import { Router, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Criar pedido
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { itens, id_endereco_entrega, metodo_pagamento, id_cupom, valor_frete } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pedido deve conter pelo menos um item'
      });
    }

    // Calcular subtotal
    let valorSubtotal = 0;
    for (const item of itens) {
      const [produto]: any = await sequelize.query(
        'SELECT preco_unitario, estoque_atual FROM produtos WHERE id_produto = :id AND ativo = 1',
        {
          replacements: { id: item.id_produto },
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (!produto) {
        return res.status(400).json({
          success: false,
          message: `Produto ${item.id_produto} não encontrado`
        });
      }

      if (produto.estoque_atual < item.quantidade) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para o produto ${item.id_produto}`
        });
      }

      valorSubtotal += Number(produto.preco_unitario) * item.quantidade;
    }

    // Calcular desconto do cupom (simplificado)
    let valorDesconto = 0;
    if (id_cupom) {
      // Implementar lógica de cupom aqui
    }

    const valorTotal = valorSubtotal - valorDesconto + (valor_frete || 0);

    // Gerar número de pedido
    const numeroPedido = `PED-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Date.now().toString().slice(-6)}`;
    
    // Criar pedido (SQLite não tem RETURNING)
    await sequelize.query(
      `INSERT INTO pedidos (
        id_cliente, id_endereco_entrega, numero_pedido, metodo_pagamento,
        valor_subtotal, valor_desconto, valor_frete, valor_total, id_cupom
      ) VALUES (
        :userId, :id_endereco_entrega, :numeroPedido, :metodo_pagamento,
        :valorSubtotal, :valorDesconto, :valor_frete, :valorTotal, :id_cupom
      )`,
      {
        replacements: {
          userId,
          id_endereco_entrega,
          numeroPedido,
          metodo_pagamento,
          valorSubtotal,
          valorDesconto,
          valor_frete: valor_frete || 0,
          valorTotal,
          id_cupom: id_cupom || null
        },
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Buscar pedido criado
    const [pedidoCriado]: any = await sequelize.query(
      `SELECT * FROM pedidos WHERE numero_pedido = :numeroPedido`,
      {
        replacements: { numeroPedido },
        type: sequelize.QueryTypes.SELECT
      }
    );
    const pedidoId = pedidoCriado[0].id_pedido;

    // Criar itens do pedido e atualizar estoque
    for (const item of itens) {
      const [produto]: any = await sequelize.query(
        'SELECT preco_unitario FROM produtos WHERE id_produto = :id',
        {
          replacements: { id: item.id_produto },
          type: sequelize.QueryTypes.SELECT
        }
      );

      const subtotal = Number(produto.preco_unitario) * item.quantidade;

      await sequelize.query(
        `INSERT INTO item_pedido (
          id_pedido, id_produto, quantidade, preco_unitario_no_pedido, subtotal
        ) VALUES (
          :pedidoId, :id_produto, :quantidade, :preco_unitario, :subtotal
        )`,
        {
          replacements: {
            pedidoId,
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            preco_unitario: produto.preco_unitario,
            subtotal
          },
          type: sequelize.QueryTypes.INSERT
        }
      );

      // Atualizar estoque
      await sequelize.query(
        'UPDATE produtos SET estoque_atual = estoque_atual - :quantidade WHERE id_produto = :id',
        {
          replacements: { quantidade: item.quantidade, id: item.id_produto },
          type: sequelize.QueryTypes.UPDATE
        }
      );
    }

    // Registrar histórico de status
    await sequelize.query(
      `INSERT INTO historico_status_pedido (id_pedido, status_novo)
       VALUES (:pedidoId, 'Confirmado')`,
      {
        replacements: { pedidoId },
        type: sequelize.QueryTypes.INSERT
      }
    );

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: pedidoCriado[0]
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Listar pedidos do usuário
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const pedidos = await sequelize.query(
      `SELECT 
        p.*,
          (SELECT GROUP_CONCAT('{"id_item":' || ip.id_item_pedido || ',"produto":{"id":' || pr.id_produto || ',"nome":"' || pr.nome_produto || '","slug":"' || pr.slug || '"},"quantidade":' || ip.quantidade || ',"preco_unitario":' || ip.preco_unitario_no_pedido || ',"subtotal":' || ip.subtotal || '}') FROM item_pedido ip
          INNER JOIN produtos pr ON ip.id_produto = pr.id_produto
          WHERE ip.id_pedido = p.id_pedido) as itens
      FROM pedidos p
      WHERE p.id_cliente = :userId
      ORDER BY p.data_pedido DESC`,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json({
      success: true,
      data: pedidos
    });
  } catch (error: any) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar pedidos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Obter pedido por ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const [pedido]: any = await sequelize.query(
      `SELECT 
        p.*,
          (SELECT GROUP_CONCAT('{"id_item":' || ip.id_item_pedido || ',"produto":{"id":' || pr.id_produto || ',"nome":"' || pr.nome_produto || '","slug":"' || pr.slug || '"},"quantidade":' || ip.quantidade || ',"preco_unitario":' || ip.preco_unitario_no_pedido || ',"subtotal":' || ip.subtotal || '}') FROM item_pedido ip
          INNER JOIN produtos pr ON ip.id_produto = pr.id_produto
          WHERE ip.id_pedido = p.id_pedido) as itens
      FROM pedidos p
      WHERE p.id_pedido = :id AND p.id_cliente = :userId`,
      {
        replacements: { id, userId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      data: pedido
    });
  } catch (error: any) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


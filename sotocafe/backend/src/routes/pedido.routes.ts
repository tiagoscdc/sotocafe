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

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: pedidoCriado[0]
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
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

    // Buscar pedidos
    const [pedidosArray]: any = await sequelize.query(
      `SELECT * FROM pedidos WHERE id_cliente = ? ORDER BY data_pedido DESC`,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    const pedidos = Array.isArray(pedidosArray) ? pedidosArray : [];

    // Buscar itens para cada pedido
    const pedidosComItens = await Promise.all(
      pedidos.map(async (pedido: any) => {
        const [itensArray]: any = await sequelize.query(
          `SELECT 
            ip.*,
            p.nome_produto,
            p.slug,
            p.id_produto
          FROM item_pedido ip
          INNER JOIN produtos p ON ip.id_produto = p.id_produto
          WHERE ip.id_pedido = ?`,
          {
            replacements: [pedido.id_pedido],
            type: sequelize.QueryTypes.SELECT
          }
        );

        const itens = Array.isArray(itensArray) ? itensArray : [];
        
        return {
          ...pedido,
          itens: itens.map((item: any) => ({
            id_item: item.id_item_pedido,
            produto: {
              id: item.id_produto,
              nome: item.nome_produto,
              slug: item.slug
            },
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario_no_pedido,
            subtotal: item.subtotal
          }))
        };
      })
    );

    res.json({
      success: true,
      data: pedidosComItens
    });
  } catch (error: any) {
    console.error('Erro ao listar pedidos:', error);
    console.error('Stack:', error.stack);
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

    const [pedidosArray]: any = await sequelize.query(
      `SELECT * FROM pedidos WHERE id_pedido = ? AND id_cliente = ?`,
      {
        replacements: [id, userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    const pedido = Array.isArray(pedidosArray) && pedidosArray.length > 0 ? pedidosArray[0] : null;

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Buscar itens do pedido
    const [itensArray]: any = await sequelize.query(
      `SELECT 
        ip.*,
        p.nome_produto,
        p.slug,
        p.id_produto
      FROM item_pedido ip
      INNER JOIN produtos p ON ip.id_produto = p.id_produto
      WHERE ip.id_pedido = ?`,
      {
        replacements: [pedido.id_pedido],
        type: sequelize.QueryTypes.SELECT
      }
    );

    const itens = Array.isArray(itensArray) ? itensArray : [];

    return res.json({
      success: true,
      data: {
        ...pedido,
        itens: itens.map((item: any) => ({
          id_item: item.id_item_pedido,
          produto: {
            id: item.id_produto,
            nome: item.nome_produto,
            slug: item.slug
          },
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario_no_pedido,
          subtotal: item.subtotal
        }))
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar pedido:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


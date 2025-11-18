import { Router, Response } from 'express';
import sequelize from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Criar pedido
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }
    
    const { itens, id_endereco_entrega, metodo_pagamento, id_cupom, valor_frete } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pedido deve conter pelo menos um item'
      });
    }
    
    if (!id_endereco_entrega) {
      return res.status(400).json({
        success: false,
        message: 'Endereço de entrega é obrigatório'
      });
    }
    
    if (!metodo_pagamento) {
      return res.status(400).json({
        success: false,
        message: 'Método de pagamento é obrigatório'
      });
    }

    // Verificar se endereço existe
    const [enderecoArray]: any = await sequelize.query(
      'SELECT id_endereco FROM enderecos WHERE id_endereco = ? AND id_usuario = ?',
      {
        replacements: [id_endereco_entrega, userId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (!enderecoArray || enderecoArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Endereço de entrega não encontrado'
      });
    }

    // Calcular subtotal e peso total
    let valorSubtotal = 0;
    let pesoTotal = 0;
    for (const item of itens) {
      const [produtoArray]: any = await sequelize.query(
        'SELECT preco_unitario, estoque_atual, peso_gramas FROM produtos WHERE id_produto = ? AND ativo = 1',
        {
          replacements: [item.id_produto],
          type: sequelize.QueryTypes.SELECT
        }
      );

      const produto = Array.isArray(produtoArray) && produtoArray.length > 0 ? produtoArray[0] : null;

      if (!produto) {
        return res.status(400).json({
          success: false,
          message: `Produto ${item.id_produto} não encontrado`
        });
      }

      valorSubtotal += Number(produto.preco_unitario) * item.quantidade;
      pesoTotal += (Number(produto.peso_gramas) || 0) * item.quantidade;
    }

    // Calcular desconto do cupom
    let valorDesconto = 0;
    if (id_cupom) {
      const [cupomArray]: any = await sequelize.query(
        `SELECT * FROM cupons_desconto 
         WHERE id_cupom = ? AND ativo = 1 
         AND data_inicio <= DATE('now') 
         AND data_fim >= DATE('now')`,
        {
          replacements: [id_cupom],
          type: sequelize.QueryTypes.SELECT
        }
      );

      const cupom = Array.isArray(cupomArray) && cupomArray.length > 0 ? cupomArray[0] : null;
      
      if (cupom) {
        // Verificar valor mínimo
        if (!cupom.valor_minimo_pedido || valorSubtotal >= cupom.valor_minimo_pedido) {
          if (cupom.tipo_desconto === 'Percentual') {
            valorDesconto = (valorSubtotal * cupom.valor_desconto) / 100;
          } else {
            valorDesconto = Math.min(cupom.valor_desconto, valorSubtotal);
          }
        }
      }
    }

    // Usar frete fornecido ou calcular um valor padrão
    let freteCalculado = valor_frete || 0;
    if (!valor_frete) {
      // Se não foi fornecido, calcular frete simples baseado no valor
      freteCalculado = valorSubtotal >= 200 ? 0 : 15.00;
    }

    const valorTotal = valorSubtotal - valorDesconto + freteCalculado;

    // Gerar número de pedido
    const numeroPedido = `PED-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Date.now().toString().slice(-6)}`;
    
    // Criar pedido (SQLite não tem RETURNING)
    await sequelize.query(
      `INSERT INTO pedidos (
        id_cliente, id_endereco_entrega, numero_pedido, metodo_pagamento,
        valor_subtotal, valor_desconto, valor_frete, valor_total, id_cupom, status_pagamento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          userId,
          id_endereco_entrega,
          numeroPedido,
          metodo_pagamento,
          valorSubtotal,
          valorDesconto,
          freteCalculado,
          valorTotal,
          id_cupom || null,
          'Pendente' // Status inicial do pagamento
        ],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Buscar pedido criado
    const [pedidoCriadoArray]: any = await sequelize.query(
      `SELECT * FROM pedidos WHERE numero_pedido = ?`,
      {
        replacements: [numeroPedido],
        type: sequelize.QueryTypes.SELECT
      }
    );
    const pedidoCriado = Array.isArray(pedidoCriadoArray) && pedidoCriadoArray.length > 0 ? pedidoCriadoArray[0] : null;
    
    if (!pedidoCriado) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar pedido'
      });
    }
    
    const pedidoId = pedidoCriado.id_pedido;

    // Criar itens do pedido e atualizar estoque
    for (const item of itens) {
      const [produtoArray]: any = await sequelize.query(
        'SELECT preco_unitario FROM produtos WHERE id_produto = ?',
        {
          replacements: [item.id_produto],
          type: sequelize.QueryTypes.SELECT
        }
      );

      const produto = Array.isArray(produtoArray) && produtoArray.length > 0 ? produtoArray[0] : null;
      if (!produto) continue;

      const subtotal = Number(produto.preco_unitario) * item.quantidade;

      await sequelize.query(
        `INSERT INTO item_pedido (
          id_pedido, id_produto, quantidade, preco_unitario_no_pedido, subtotal
        ) VALUES (?, ?, ?, ?, ?)`,
        {
          replacements: [
            pedidoId,
            item.id_produto,
            item.quantidade,
            produto.preco_unitario,
            subtotal
          ],
          type: sequelize.QueryTypes.INSERT
        }
      );

      // Atualizar estoque (opcional para sistema acadêmico)
      try {
        await sequelize.query(
          'UPDATE produtos SET estoque_atual = estoque_atual - ? WHERE id_produto = ?',
          {
            replacements: [item.quantidade, item.id_produto],
            type: sequelize.QueryTypes.UPDATE
          }
        );
      } catch (e) {
        // Ignorar erros de estoque em sistema acadêmico
        console.warn('Erro ao atualizar estoque (ignorado):', e);
      }
    }

    // Registrar histórico de status
    try {
      await sequelize.query(
        `INSERT INTO historico_status_pedido (id_pedido, status_novo)
         VALUES (?, ?)`,
        {
          replacements: [pedidoId, 'Confirmado'],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } catch (e) {
      // Ignorar erros de histórico em sistema acadêmico
      console.warn('Erro ao registrar histórico (ignorado):', e);
    }

    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: pedidoCriado
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    console.error('Stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      path: error.path,
      userId: req.user?.id,
      body: req.body
    });
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
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

    // Buscar itens e cupom para cada pedido
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
        
        // Buscar informações do cupom se houver
        let cupomInfo = null;
        if (pedido.id_cupom) {
          const [cupomArray]: any = await sequelize.query(
            'SELECT codigo_cupom, tipo_desconto, valor_desconto FROM cupons_desconto WHERE id_cupom = ?',
            {
              replacements: [pedido.id_cupom],
              type: sequelize.QueryTypes.SELECT
            }
          );
          cupomInfo = Array.isArray(cupomArray) && cupomArray.length > 0 ? cupomArray[0] : null;
        }
        
        return {
          ...pedido,
          cupom: cupomInfo,
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

    // Buscar informações do cupom se houver
    let cupomInfo = null;
    if (pedido.id_cupom) {
      const [cupomArray]: any = await sequelize.query(
        'SELECT codigo_cupom, tipo_desconto, valor_desconto FROM cupons_desconto WHERE id_cupom = ?',
        {
          replacements: [pedido.id_cupom],
          type: sequelize.QueryTypes.SELECT
        }
      );
      cupomInfo = Array.isArray(cupomArray) && cupomArray.length > 0 ? cupomArray[0] : null;
    }

    // Buscar informações do endereço de entrega
    let enderecoInfo = null;
    if (pedido.id_endereco_entrega) {
      const [enderecoArray]: any = await sequelize.query(
        'SELECT * FROM enderecos WHERE id_endereco = ?',
        {
          replacements: [pedido.id_endereco_entrega],
          type: sequelize.QueryTypes.SELECT
        }
      );
      enderecoInfo = Array.isArray(enderecoArray) && enderecoArray.length > 0 ? enderecoArray[0] : null;
    }

    return res.json({
      success: true,
      data: {
        ...pedido,
        cupom: cupomInfo,
        endereco: enderecoInfo,
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


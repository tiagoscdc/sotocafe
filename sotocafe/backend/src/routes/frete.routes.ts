import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Calcular frete baseado no CEP e peso total
router.post('/calcular', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { cep, peso_total_gramas, valor_subtotal } = req.body;

    if (!cep) {
      return res.status(400).json({
        success: false,
        message: 'CEP é obrigatório'
      });
    }

    // Cálculo simplificado de frete (sistema acadêmico)
    // Em produção, isso seria integrado com uma API de frete real (Correios, etc)
    
    let valorFrete = 0;
    
    // Frete grátis para pedidos acima de R$ 200
    if (valor_subtotal && valor_subtotal >= 200) {
      valorFrete = 0;
    } else {
      // Calcular frete baseado no peso
      const pesoKg = (peso_total_gramas || 0) / 1000;
      
      // Tabela de frete simplificada
      if (pesoKg <= 0.5) {
        valorFrete = 10.00;
      } else if (pesoKg <= 1) {
        valorFrete = 15.00;
      } else if (pesoKg <= 2) {
        valorFrete = 20.00;
      } else if (pesoKg <= 5) {
        valorFrete = 30.00;
      } else {
        valorFrete = 40.00 + ((pesoKg - 5) * 5); // R$ 5 por kg adicional
      }
      
      // Ajuste por região (simplificado - baseado no CEP)
      const cepNum = parseInt(cep.replace(/\D/g, ''));
      if (cepNum >= 1000000 && cepNum < 2000000) {
        // São Paulo - frete mais barato
        valorFrete = valorFrete * 0.8;
      } else if (cepNum >= 20000000 && cepNum < 30000000) {
        // Rio de Janeiro
        valorFrete = valorFrete * 0.9;
      } else if (cepNum >= 30000000 && cepNum < 40000000) {
        // Minas Gerais
        valorFrete = valorFrete * 0.95;
      } else {
        // Outras regiões - frete mais caro
        valorFrete = valorFrete * 1.2;
      }
    }

    return res.json({
      success: true,
      data: {
        valor_frete: Math.round(valorFrete * 100) / 100, // Arredondar para 2 casas decimais
        prazo_entrega: '5 a 10 dias úteis',
        tipo_entrega: 'PAC'
      }
    });
  } catch (error: any) {
    console.error('Erro ao calcular frete:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao calcular frete',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

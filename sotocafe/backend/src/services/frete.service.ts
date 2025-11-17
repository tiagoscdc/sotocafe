// Serviço para cálculo de frete
// Sistema acadêmico - cálculo simplificado baseado em CEP e peso

interface CalculoFreteParams {
  cep: string;
  pesoTotal: number; // em gramas
  valorSubtotal: number;
}

export const calcularFrete = ({ cep, pesoTotal, valorSubtotal }: CalculoFreteParams): number => {
  // Sistema acadêmico - cálculo simplificado
  
  // Frete grátis para pedidos acima de R$ 200
  if (valorSubtotal >= 200) {
    return 0;
  }

  // Base de cálculo: R$ 10,00
  let frete = 10.00;

  // Adicionar por peso (R$ 0,01 por 100g)
  const pesoAdicional = Math.ceil(pesoTotal / 100) * 0.01;
  frete += pesoAdicional;

  // Ajuste por região (simplificado - baseado no primeiro dígito do CEP)
  const primeiroDigito = parseInt(cep.charAt(0));
  
  // Regiões mais distantes (8 e 9) têm frete mais caro
  if (primeiroDigito >= 8) {
    frete += 5.00;
  } else if (primeiroDigito >= 6) {
    frete += 3.00;
  }

  // Limitar frete máximo em R$ 30,00
  return Math.min(frete, 30.00);
};


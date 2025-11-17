// Este arquivo contém dados expandidos para popular o banco
// Foi separado para manter o seed.routes.ts mais limpo

export const usuariosExpandidos: Array<[string, string, string, string]> = [
  ['Administrador', 'admin@sotocafe.com', '(11) 99999-9999', 'Administrador'],
  ['João Monteiro', 'joao@email.com', '(11) 98888-8888', 'Cliente'],
  ['Ana Carolina Silva', 'ana@email.com', '(11) 97777-7777', 'Cliente'],
  ['Roberto Martins', 'roberto@email.com', '(11) 96666-6666', 'Cliente'],
  ['Maria Santos', 'maria@email.com', '(11) 95555-5555', 'Cliente'],
  ['Pedro Oliveira', 'pedro@email.com', '(11) 94444-4444', 'Cliente'],
  ['Carla Ferreira', 'carla@email.com', '(11) 93333-3333', 'Cliente'],
  ['Lucas Costa', 'lucas@email.com', '(11) 92222-2222', 'Cliente'],
  ['Fernanda Lima', 'fernanda@email.com', '(11) 91111-1111', 'Cliente'],
  ['Rafael Souza', 'rafael@email.com', '(11) 90000-0000', 'Cliente'],
  ['Gerente Conteúdo', 'gerente@sotocafe.com', '(11) 98877-6655', 'Gerente_Conteudo'],
  ['Expedição', 'expedicao@sotocafe.com', '(11) 97766-5544', 'Expedicao'],
];

export const produtosExpandidos = (catGrao: number, catMoido: number, catCapsula: number, catAcessorio: number, catKits: number): Array<Array<any>> => [
  // Cafés em Grão
  [catGrao, 'Café Especial Cerrado Mineiro', 'Café especial com notas de chocolate e caramelo, corpo encorpado e acidez suave', 'Café especial com notas de chocolate', 'cafe-especial-cerrado-mineiro', 'CAF-001', 45.90, 100, 500, 1, 1, 'Cerrado Mineiro - MG', 'Média'],
  [catGrao, 'Café Gourmet Mogiana', 'Café gourmet com corpo encorpado e sabor marcante', 'Café gourmet com corpo encorpado', 'cafe-gourmet-mogiana', 'CAF-002', 42.50, 80, 500, 1, 1, 'Mogiana - SP', 'Média-Escura'],
  [catGrao, 'Café Especial Chapada de Minas', 'Café especial com notas frutadas e floral', 'Café especial com notas frutadas', 'cafe-especial-chapada-minas', 'CAF-003', 52.90, 60, 500, 1, 0, 'Chapada de Minas - MG', 'Clara'],
  [catGrao, 'Café Bourbon Amarelo', 'Café Bourbon com notas de mel e caramelo', 'Café Bourbon especial', 'cafe-bourbon-amarelo', 'CAF-004', 58.90, 50, 500, 1, 1, 'Sul de Minas - MG', 'Média'],
  [catGrao, 'Café Catuaí Vermelho', 'Café Catuaí com corpo médio e acidez cítrica', 'Café Catuaí especial', 'cafe-catuai-vermelho', 'CAF-005', 48.90, 70, 500, 1, 0, 'Alta Mogiana - SP', 'Média-Clara'],
  [catGrao, 'Café Mundo Novo', 'Café com notas de nozes e chocolate amargo', 'Café Mundo Novo', 'cafe-mundo-novo', 'CAF-006', 44.90, 90, 500, 1, 0, 'Cerrado - MG', 'Média-Escura'],
  [catGrao, 'Café Acaiá', 'Café com sabor suave e doce', 'Café Acaiá especial', 'cafe-acaia', 'CAF-007', 46.90, 75, 500, 1, 0, 'Mantiqueira - MG', 'Média'],
  [catGrao, 'Café Geisha', 'Café premium com notas florais e frutadas complexas', 'Café Geisha premium', 'cafe-geisha', 'CAF-008', 89.90, 30, 250, 1, 1, 'Chapada de Diamantina - BA', 'Clara'],
  [catGrao, 'Café Pacamara', 'Café com grãos grandes e sabor intenso', 'Café Pacamara especial', 'cafe-pacamara', 'CAF-009', 65.90, 40, 500, 1, 1, 'Sul de Minas - MG', 'Média-Escura'],
  [catGrao, 'Café Yellow Bourbon', 'Café Bourbon amarelo com notas de frutas vermelhas', 'Café Yellow Bourbon', 'cafe-yellow-bourbon', 'CAF-010', 54.90, 55, 500, 1, 0, 'Alta Mogiana - SP', 'Média'],
  
  // Cafés Moídos
  [catMoido, 'Café Moído Tradicional', 'Café moído para coador, sabor tradicional brasileiro', 'Café moído tradicional', 'cafe-moido-tradicional', 'CAF-101', 38.90, 120, 500, 1, 0, 'Brasil', 'Média'],
  [catMoido, 'Café Moído para Espresso', 'Café moído fino para espresso, cremoso e encorpado', 'Café moído para espresso', 'cafe-moido-espresso', 'CAF-102', 41.90, 90, 500, 1, 1, 'Brasil', 'Média-Escura'],
  [catMoido, 'Café Moído para French Press', 'Moagem grossa ideal para French Press', 'Café moído French Press', 'cafe-moido-french-press', 'CAF-103', 39.90, 85, 500, 1, 0, 'Brasil', 'Média'],
  [catMoido, 'Café Moído para Cafeteira Italiana', 'Moagem média-fina para cafeteira italiana', 'Café moído cafeteira italiana', 'cafe-moido-cafeteira-italiana', 'CAF-104', 40.90, 80, 500, 1, 0, 'Brasil', 'Média-Escura'],
  [catMoido, 'Café Moído Premium', 'Café moído premium com grãos selecionados', 'Café moído premium', 'cafe-moido-premium', 'CAF-105', 49.90, 70, 500, 1, 1, 'Brasil', 'Média'],
  
  // Cápsulas
  [catCapsula, 'Cápsulas Compatíveis Nespresso', 'Cápsulas compatíveis com máquinas Nespresso', 'Cápsulas Nespresso', 'capsulas-nespresso', 'CAP-001', 29.90, 200, 50, 1, 1, null, null],
  [catCapsula, 'Cápsulas Dolce Gusto', 'Cápsulas compatíveis com Dolce Gusto', 'Cápsulas Dolce Gusto', 'capsulas-dolce-gusto', 'CAP-002', 27.90, 180, 50, 1, 0, null, null],
  [catCapsula, 'Cápsulas Expresso Intenso', 'Cápsulas de expresso intenso', 'Cápsulas expresso intenso', 'capsulas-expresso-intenso', 'CAP-003', 31.90, 150, 50, 1, 1, null, null],
  [catCapsula, 'Cápsulas Ristretto', 'Cápsulas de ristretto concentrado', 'Cápsulas ristretto', 'capsulas-ristretto', 'CAP-004', 32.90, 140, 50, 1, 0, null, null],
  [catCapsula, 'Cápsulas Lungo', 'Cápsulas de lungo suave', 'Cápsulas lungo', 'capsulas-lungo', 'CAP-005', 30.90, 160, 50, 1, 0, null, null],
  
  // Acessórios
  [catAcessorio, 'Xícara de Porcelana Premium', 'Xícara premium 200ml com design elegante', 'Xícara de porcelana', 'xicara-porcelana-premium', 'ACC-001', 35.90, 50, 200, 1, 0, null, null],
  [catAcessorio, 'Cafeteira Italiana 6 Xícaras', 'Cafeteira italiana tradicional 6 xícaras', 'Cafeteira italiana', 'cafeteira-italiana-6', 'ACC-002', 89.90, 30, 500, 1, 1, null, null],
  [catAcessorio, 'Moedor de Café Manual', 'Moedor manual com regulagem de moagem', 'Moedor de café manual', 'moedor-cafe-manual', 'ACC-003', 125.90, 25, 800, 1, 0, null, null],
  [catAcessorio, 'French Press 350ml', 'French Press de vidro borossilicato 350ml', 'French Press 350ml', 'french-press-350ml', 'ACC-004', 79.90, 40, 400, 1, 1, null, null],
  [catAcessorio, 'French Press 1L', 'French Press de vidro borossilicato 1 litro', 'French Press 1L', 'french-press-1l', 'ACC-005', 119.90, 35, 600, 1, 0, null, null],
  [catAcessorio, 'Hario V60', 'Filtro Hario V60 cerâmico com suporte', 'Hario V60', 'hario-v60', 'ACC-006', 95.90, 28, 300, 1, 1, null, null],
  [catAcessorio, 'Filtros de Papel V60', 'Filtros de papel para Hario V60, pacote com 100 unidades', 'Filtros V60', 'filtros-v60', 'ACC-007', 24.90, 100, 100, 1, 0, null, null],
  [catAcessorio, 'Balança de Precisão', 'Balança digital de precisão para café, até 2kg', 'Balança de precisão', 'balanca-precisao', 'ACC-008', 89.90, 20, 200, 1, 0, null, null],
  [catAcessorio, 'Termômetro Digital', 'Termômetro digital para controle de temperatura da água', 'Termômetro digital', 'termometro-digital', 'ACC-009', 45.90, 30, 50, 1, 0, null, null],
  [catAcessorio, 'Caneca Térmica 350ml', 'Caneca térmica de aço inox 350ml', 'Caneca térmica', 'caneca-termica-350ml', 'ACC-010', 39.90, 60, 250, 1, 0, null, null],
  [catAcessorio, 'Kit de Degustação', 'Kit com 4 xícaras pequenas para degustação', 'Kit degustação', 'kit-degustacao', 'ACC-011', 49.90, 25, 300, 1, 0, null, null],
  [catAcessorio, 'Colher Medidora', 'Colher medidora de café em aço inox', 'Colher medidora', 'colher-medidora', 'ACC-012', 12.90, 80, 20, 1, 0, null, null],
  
  // Kits
  [catKits, 'Kit Iniciante', 'Kit completo para iniciantes: cafeteira italiana, café moído e xícaras', 'Kit iniciante', 'kit-iniciante', 'KIT-001', 199.90, 15, 1200, 1, 1, null, null],
  [catKits, 'Kit Barista', 'Kit profissional: Hario V60, balança, termômetro e café especial', 'Kit barista', 'kit-barista', 'KIT-002', 349.90, 10, 1500, 1, 1, null, null],
  [catKits, 'Kit Presente', 'Kit presente elegante com café especial e acessórios premium', 'Kit presente', 'kit-presente', 'KIT-003', 279.90, 12, 1000, 1, 0, null, null],
];

export const enderecosExpandidos: Array<[string, string, string, string, string, string, string, string, string, number]> = [
  ['joao@email.com', 'Residencial', '01310-100', 'Avenida Paulista', '1000', 'Apto 101', 'Bela Vista', 'São Paulo', 'SP', 1],
  ['ana@email.com', 'Residencial', '04547-130', 'Rua das Flores', '250', 'Casa', 'Vila Olímpia', 'São Paulo', 'SP', 1],
  ['roberto@email.com', 'Comercial', '20040-020', 'Avenida Rio Branco', '156', 'Sala 1205', 'Centro', 'Rio de Janeiro', 'RJ', 1],
  ['maria@email.com', 'Residencial', '30130-010', 'Rua da Bahia', '1200', 'Apto 302', 'Centro', 'Belo Horizonte', 'MG', 1],
  ['pedro@email.com', 'Residencial', '40020-000', 'Rua Chile', '25', 'Loja 3', 'Pelourinho', 'Salvador', 'BA', 1],
];

export const cuponsExpandidos: Array<[string, string, number, number, number, number]> = [
  ['BEMVINDO10', 'Percentual', 10.00, 50.00, 1, 1],
  ['FRETEGRATIS', 'Valor_Fixo', 0.00, 100.00, 1, 1],
  ['CAFE20', 'Percentual', 20.00, 80.00, 1, 0],
  ['BLACKFRIDAY', 'Percentual', 30.00, 150.00, 1, 1],
  ['NATAL25', 'Percentual', 25.00, 120.00, 1, 1],
  ['PRIMEIRA', 'Valor_Fixo', 15.00, 50.00, 1, 1],
];

// Função para gerar pedidos de exemplo
export const gerarPedidosExemplo = async (sequelize: any) => {
  // Buscar usuários clientes
  const [clientesArray]: any = await sequelize.query(
    "SELECT id_usuario FROM usuarios WHERE tipoUsuario = 'Cliente' LIMIT 5"
  );
  const clientes = Array.isArray(clientesArray) ? clientesArray : [];
  
  // Garantir que clientes é um array de objetos
  const clientesFormatados = clientes.map((c: any) => ({
    id_usuario: c.id_usuario || c
  }));

  // Buscar produtos
  const [produtosArray]: any = await sequelize.query(
    'SELECT id_produto, preco_unitario, peso_gramas FROM produtos WHERE ativo = 1 LIMIT 10'
  );
  const produtos = Array.isArray(produtosArray) ? produtosArray : [];

  // Buscar endereços
  const [enderecosArray]: any = await sequelize.query(
    'SELECT id_endereco, id_usuario, cep FROM enderecos'
  );
  const enderecos = Array.isArray(enderecosArray) ? enderecosArray : [];

  // Buscar cupons
  const [cuponsArray]: any = await sequelize.query(
    "SELECT id_cupom FROM cupons_desconto WHERE ativo = 1 LIMIT 3"
  );
  const cupons = Array.isArray(cuponsArray) ? cuponsArray : [];

  const pedidos = [];

  for (let i = 0; i < Math.min(5, clientesFormatados.length); i++) {
    const cliente = clientesFormatados[i];
    const clienteId = cliente.id_usuario;
    const enderecoCliente = enderecos.find((e: any) => e.id_usuario === clienteId);
    
    if (!enderecoCliente || produtos.length === 0) continue;

    // Selecionar 1-3 produtos aleatórios
    const numItens = Math.floor(Math.random() * 3) + 1;
    const produtosSelecionados = produtos.slice(0, numItens);
    
    // Calcular valores
    let valorSubtotal = 0;
    let pesoTotal = 0;
    const itensPedido: any[] = [];

    for (const produto of produtosSelecionados) {
      const quantidade = Math.floor(Math.random() * 3) + 1;
      valorSubtotal += Number(produto.preco_unitario) * quantidade;
      pesoTotal += (Number(produto.peso_gramas) || 0) * quantidade;
      itensPedido.push({ id_produto: produto.id_produto, quantidade });
    }

    // Aplicar cupom aleatório (50% de chance)
    let valorDesconto = 0;
    let idCupom = null;
    if (Math.random() > 0.5 && cupons.length > 0) {
      const cupomAleatorio = cupons[Math.floor(Math.random() * cupons.length)];
      // Buscar cupom completo para calcular desconto corretamente
      const [cupomCompletoArray]: any = await sequelize.query(
        'SELECT * FROM cupons_desconto WHERE id_cupom = ?',
        { replacements: [cupomAleatorio.id_cupom], type: sequelize.QueryTypes.SELECT }
      );
      const cupomCompleto = Array.isArray(cupomCompletoArray) && cupomCompletoArray.length > 0 ? cupomCompletoArray[0] : null;
      
      if (cupomCompleto && (!cupomCompleto.valor_minimo_pedido || valorSubtotal >= cupomCompleto.valor_minimo_pedido)) {
        idCupom = cupomCompleto.id_cupom;
        if (cupomCompleto.tipo_desconto === 'Percentual') {
          valorDesconto = (valorSubtotal * cupomCompleto.valor_desconto) / 100;
        } else {
          valorDesconto = Math.min(cupomCompleto.valor_desconto, valorSubtotal);
        }
      }
    }

    // Calcular frete simplificado
    const valorFrete = valorSubtotal >= 200 ? 0 : 15.00;
    const valorTotal = valorSubtotal - valorDesconto + valorFrete;

    // Gerar número de pedido
    const dataPedido = new Date();
    dataPedido.setDate(dataPedido.getDate() - Math.floor(Math.random() * 30)); // Pedidos dos últimos 30 dias
    const numeroPedido = `PED-${dataPedido.toISOString().split('T')[0].replace(/-/g, '')}-${String(i + 1).padStart(6, '0')}`;

    // Método de pagamento aleatório
    const metodos = ['Pix', 'Boleto', 'Cartao_Credito'];
    const metodoPagamento = metodos[Math.floor(Math.random() * metodos.length)];

    // Status aleatório
    const statuses = ['Confirmado', 'Em_Preparacao', 'Enviado', 'Entregue'];
    const statusPedido = statuses[Math.floor(Math.random() * statuses.length)];
    const statusPagamento = statusPedido === 'Entregue' ? 'Aprovado' : 'Pendente';

    pedidos.push({
      cliente: clienteId,
      endereco: enderecoCliente.id_endereco,
      numeroPedido,
      dataPedido: dataPedido.toISOString(),
      metodoPagamento,
      statusPedido,
      statusPagamento,
      valorSubtotal,
      valorDesconto,
      valorFrete,
      valorTotal,
      idCupom,
      itens: itensPedido
    });
  }

  return pedidos;
};


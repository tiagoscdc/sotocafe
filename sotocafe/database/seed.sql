-- ============================================
-- SOTO CAFÉ - Dados de Exemplo (Seed)
-- Script para popular o banco com dados de teste
-- ============================================

-- Limpar dados existentes (opcional - descomente se necessário)
-- TRUNCATE TABLE item_pedido, pedidos, item_carrinho, carrinho, historico_pontos, programa_fidelidade, 
--   historico_status_pedido, imagens_produto, produtos, categorias, enderecos, usuarios CASCADE;

-- ============================================
-- USUÁRIOS
-- ============================================

-- Senha padrão para todos: 123456
-- Hash bcrypt válido gerado para senha "123456"
INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo_usuario, status, email_verificado) VALUES
('Administrador', 'admin@sotocafe.com', '$2a$10$oxbyKJ.I/9Q2PHFFacKaqed/P06lT63mELMUO2EgxPSOoXR/3e63K', '(11) 99999-9999', 'Administrador', 'Ativo', true),
('João Monteiro', 'joao@email.com', '$2a$10$oxbyKJ.I/9Q2PHFFacKaqed/P06lT63mELMUO2EgxPSOoXR/3e63K', '(11) 98888-8888', 'Cliente', 'Ativo', true),
('Ana Carolina Silva', 'ana@email.com', '$2a$10$oxbyKJ.I/9Q2PHFFacKaqed/P06lT63mELMUO2EgxPSOoXR/3e63K', '(11) 97777-7777', 'Cliente', 'Ativo', true),
('Roberto Martins', 'roberto@email.com', '$2a$10$oxbyKJ.I/9Q2PHFFacKaqed/P06lT63mELMUO2EgxPSOoXR/3e63K', '(11) 96666-6666', 'Cliente', 'Ativo', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- ENDEREÇOS
-- ============================================

INSERT INTO enderecos (id_usuario, tipo_endereco, cep, rua, numero, complemento, bairro, cidade, estado, endereco_principal)
SELECT 
    u.id_usuario,
    'Residencial',
    '01310-100',
    'Avenida Paulista',
    '1000',
    'Apto 101',
    'Bela Vista',
    'São Paulo',
    'SP',
    true
FROM usuarios u WHERE u.email = 'joao@email.com'
ON CONFLICT DO NOTHING;

INSERT INTO enderecos (id_usuario, tipo_endereco, cep, rua, numero, complemento, bairro, cidade, estado, endereco_principal)
SELECT 
    u.id_usuario,
    'Residencial',
    '20040-020',
    'Rua do Ouvidor',
    '50',
    NULL,
    'Centro',
    'Rio de Janeiro',
    'RJ',
    true
FROM usuarios u WHERE u.email = 'ana@email.com'
ON CONFLICT DO NOTHING;

INSERT INTO enderecos (id_usuario, tipo_endereco, cep, rua, numero, complemento, bairro, cidade, estado, endereco_principal)
SELECT 
    u.id_usuario,
    'Residencial',
    '30130-010',
    'Avenida Afonso Pena',
    '3000',
    'Casa',
    'Centro',
    'Belo Horizonte',
    'MG',
    true
FROM usuarios u WHERE u.email = 'roberto@email.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- CATEGORIAS
-- ============================================

INSERT INTO categorias (nome_categoria, slug, descricao, ordem_exibicao, ativo, imagem) VALUES
('Cafés em Grão', 'cafes-grao', 'Cafés especiais em grão para você moer na hora', 1, true, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
('Cafés Moídos', 'cafes-moidos', 'Cafés já moídos, prontos para preparo', 2, true, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),
('Cápsulas', 'capsulas', 'Cápsulas compatíveis com máquinas de café', 3, true, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),
('Acessórios', 'acessorios', 'Xícaras, cafeteiras e acessórios para café', 4, true, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),
('Kits', 'kits', 'Kits especiais e presentes', 5, true, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PRODUTOS
-- ============================================

-- Cafés em Grão
INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque, origem, nivel_torra, notas_sensoriais, tipo_moagem)
SELECT 
    c.id_categoria,
    'Café Especial Cerrado Mineiro',
    'Café especial produzido na região do Cerrado Mineiro, com notas de chocolate e caramelo. Torra média que realça a doçura natural do grão.',
    'Café especial com notas de chocolate e caramelo',
    'cafe-especial-cerrado-mineiro',
    'CAF-001',
    45.90,
    100,
    10,
    500,
    true,
    true,
    'Cerrado Mineiro - MG',
    'Média',
    'Chocolate, caramelo, doce',
    'Grão'
FROM categorias c WHERE c.slug = 'cafes-grao'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque, origem, nivel_torra, notas_sensoriais, tipo_moagem)
SELECT 
    c.id_categoria,
    'Café Gourmet Mogiana',
    'Café gourmet da região de Mogiana, conhecida pela qualidade dos seus cafés. Torra média-escura com corpo encorpado e acidez equilibrada.',
    'Café gourmet com corpo encorpado',
    'cafe-gourmet-mogiana',
    'CAF-002',
    42.50,
    80,
    10,
    500,
    true,
    true,
    'Mogiana - SP',
    'Média-Escura',
    'Nozes, chocolate amargo, corpo encorpado',
    'Grão'
FROM categorias c WHERE c.slug = 'cafes-grao'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque, origem, nivel_torra, notas_sensoriais, tipo_moagem)
SELECT 
    c.id_categoria,
    'Café Especial Chapada de Minas',
    'Café especial de alta altitude da Chapada de Minas. Torra clara que preserva as notas frutadas e florais características da região.',
    'Café especial com notas frutadas e florais',
    'cafe-especial-chapada-minas',
    'CAF-003',
    52.90,
    60,
    10,
    500,
    true,
    false,
    'Chapada de Minas - MG',
    'Clara',
    'Frutas vermelhas, floral, doce',
    'Grão'
FROM categorias c WHERE c.slug = 'cafes-grao'
ON CONFLICT (slug) DO NOTHING;

-- Cafés Moídos
INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque, origem, nivel_torra, tipo_moagem)
SELECT 
    c.id_categoria,
    'Café Moído Tradicional',
    'Café moído na granulometria média, ideal para coador de pano ou papel. Torra média com sabor equilibrado.',
    'Café moído tradicional para coador',
    'cafe-moido-tradicional',
    'CAF-004',
    38.90,
    120,
    10,
    500,
    true,
    false,
    'Brasil',
    'Média',
    'Média'
FROM categorias c WHERE c.slug = 'cafes-moidos'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque, origem, nivel_torra, tipo_moagem)
SELECT 
    c.id_categoria,
    'Café Moído para Espresso',
    'Café moído fino, especialmente desenvolvido para máquinas de espresso. Torra média-escura com crema abundante.',
    'Café moído fino para espresso',
    'cafe-moido-espresso',
    'CAF-005',
    41.90,
    90,
    10,
    500,
    true,
    true,
    'Brasil',
    'Média-Escura',
    'Fina'
FROM categorias c WHERE c.slug = 'cafes-moidos'
ON CONFLICT (slug) DO NOTHING;

-- Cápsulas
INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque)
SELECT 
    c.id_categoria,
    'Cápsulas Compatíveis Nespresso',
    'Cápsulas compatíveis com máquinas Nespresso. Café especial torrado e moído na medida certa.',
    'Cápsulas compatíveis Nespresso',
    'capsulas-nespresso',
    'CAP-001',
    29.90,
    200,
    20,
    50,
    true,
    true
FROM categorias c WHERE c.slug = 'capsulas'
ON CONFLICT (slug) DO NOTHING;

-- Acessórios
INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque)
SELECT 
    c.id_categoria,
    'Xícara de Porcelana Premium',
    'Xícara de porcelana premium com capacidade de 200ml. Design elegante e atemporal.',
    'Xícara de porcelana premium 200ml',
    'xicara-porcelana-premium',
    'ACC-001',
    35.90,
    50,
    5,
    200,
    true,
    false
FROM categorias c WHERE c.slug = 'acessorios'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque)
SELECT 
    c.id_categoria,
    'Cafeteira Italiana 6 Xícaras',
    'Cafeteira italiana (moka) de alumínio com capacidade para 6 xícaras. Produz um café encorpado e saboroso.',
    'Cafeteira italiana 6 xícaras',
    'cafeteira-italiana-6',
    'ACC-002',
    89.90,
    30,
    5,
    500,
    true,
    true
FROM categorias c WHERE c.slug = 'acessorios'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO produtos (id_categoria, nome_produto, descricao, descricao_curta, slug, sku, preco_unitario, estoque_atual, estoque_minimo, peso_gramas, ativo, destaque)
SELECT 
    c.id_categoria,
    'Moedor de Café Manual',
    'Moedor de café manual com regulagem de moagem. Permite moer na hora para máximo frescor.',
    'Moedor de café manual com regulagem',
    'moedor-cafe-manual',
    'ACC-003',
    125.90,
    25,
    5,
    800,
    true,
    false
FROM categorias c WHERE c.slug = 'acessorios'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- IMAGENS DOS PRODUTOS
-- ============================================

-- Imagens para Café Especial Cerrado Mineiro
INSERT INTO imagens_produto (id_produto, url_imagem, ordem, principal, alt_text)
SELECT 
    p.id_produto,
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    1,
    true,
    'Café Especial Cerrado Mineiro'
FROM produtos p WHERE p.slug = 'cafe-especial-cerrado-mineiro'
ON CONFLICT DO NOTHING;

-- Imagens para Café Gourmet Mogiana
INSERT INTO imagens_produto (id_produto, url_imagem, ordem, principal, alt_text)
SELECT 
    p.id_produto,
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
    1,
    true,
    'Café Gourmet Mogiana'
FROM produtos p WHERE p.slug = 'cafe-gourmet-mogiana'
ON CONFLICT DO NOTHING;

-- Imagens para Café Especial Chapada de Minas
INSERT INTO imagens_produto (id_produto, url_imagem, ordem, principal, alt_text)
SELECT 
    p.id_produto,
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800',
    1,
    true,
    'Café Especial Chapada de Minas'
FROM produtos p WHERE p.slug = 'cafe-especial-chapada-minas'
ON CONFLICT DO NOTHING;

-- Imagens para outros produtos
INSERT INTO imagens_produto (id_produto, url_imagem, ordem, principal, alt_text)
SELECT 
    p.id_produto,
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
    1,
    true,
    p.nome_produto
FROM produtos p 
WHERE p.slug IN ('cafe-moido-tradicional', 'cafe-moido-espresso', 'capsulas-nespresso', 
                 'xicara-porcelana-premium', 'cafeteira-italiana-6', 'moedor-cafe-manual')
ON CONFLICT DO NOTHING;

-- ============================================
-- PROGRAMA DE FIDELIDADE
-- ============================================

INSERT INTO programa_fidelidade (id_usuario, saldo_pontos, pontos_totais_ganhos, pontos_totais_resgatados)
SELECT 
    u.id_usuario,
    150,
    500,
    350
FROM usuarios u WHERE u.email = 'joao@email.com'
ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO programa_fidelidade (id_usuario, saldo_pontos, pontos_totais_ganhos, pontos_totais_resgatados)
SELECT 
    u.id_usuario,
    80,
    200,
    120
FROM usuarios u WHERE u.email = 'ana@email.com'
ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO programa_fidelidade (id_usuario, saldo_pontos, pontos_totais_ganhos, pontos_totais_resgatados)
SELECT 
    u.id_usuario,
    0,
    0,
    0
FROM usuarios u WHERE u.email = 'roberto@email.com'
ON CONFLICT (id_usuario) DO NOTHING;

-- ============================================
-- HISTÓRICO DE PONTOS
-- ============================================

INSERT INTO historico_pontos (id_fidelidade, tipo_movimentacao, pontos, descricao, data_movimentacao)
SELECT 
    pf.id_fidelidade,
    'Ganho',
    200,
    'Pontos ganhos na compra do pedido #PED-001',
    CURRENT_TIMESTAMP - INTERVAL '30 days'
FROM programa_fidelidade pf
INNER JOIN usuarios u ON pf.id_usuario = u.id_usuario
WHERE u.email = 'joao@email.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_pontos (id_fidelidade, tipo_movimentacao, pontos, descricao, data_movimentacao)
SELECT 
    pf.id_fidelidade,
    'Ganho',
    300,
    'Pontos ganhos na compra do pedido #PED-002',
    CURRENT_TIMESTAMP - INTERVAL '15 days'
FROM programa_fidelidade pf
INNER JOIN usuarios u ON pf.id_usuario = u.id_usuario
WHERE u.email = 'joao@email.com'
ON CONFLICT DO NOTHING;

INSERT INTO historico_pontos (id_fidelidade, tipo_movimentacao, pontos, descricao, data_movimentacao)
SELECT 
    pf.id_fidelidade,
    'Resgate',
    -350,
    'Resgate de pontos para desconto',
    CURRENT_TIMESTAMP - INTERVAL '10 days'
FROM programa_fidelidade pf
INNER JOIN usuarios u ON pf.id_usuario = u.id_usuario
WHERE u.email = 'joao@email.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- CUPONS DE DESCONTO
-- ============================================

INSERT INTO cupons_desconto (codigo_cupom, tipo_desconto, valor_desconto, data_inicio, data_fim, limite_usos_total, limite_usos_por_cliente, valor_minimo_pedido, ativo, aplicavel_todos_produtos)
VALUES
('BEMVINDO10', 'Percentual', 10.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 100, 1, 50.00, true, true),
('FRETEGRATIS', 'Valor_Fixo', 0.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 200, 2, 100.00, true, true),
('CAFE20', 'Percentual', 20.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 50, 1, 80.00, true, false)
ON CONFLICT (codigo_cupom) DO NOTHING;

-- Cupom específico para categorias
INSERT INTO cupom_categoria (id_cupom, id_categoria)
SELECT 
    c.id_cupom,
    cat.id_categoria
FROM cupons_desconto c
CROSS JOIN categorias cat
WHERE c.codigo_cupom = 'CAFE20' AND cat.slug = 'cafes-grao'
ON CONFLICT DO NOTHING;

-- ============================================
-- PEDIDOS DE EXEMPLO
-- ============================================

-- Pedido 1 - João
DO $$
DECLARE
    v_user_id BIGINT;
    v_endereco_id BIGINT;
    v_produto1_id BIGINT;
    v_produto2_id BIGINT;
    v_pedido_id BIGINT;
    v_numero_pedido VARCHAR(50);
BEGIN
    -- Buscar IDs
    SELECT id_usuario INTO v_user_id FROM usuarios WHERE email = 'joao@email.com';
    SELECT id_endereco INTO v_endereco_id FROM enderecos WHERE id_usuario = v_user_id LIMIT 1;
    SELECT id_produto INTO v_produto1_id FROM produtos WHERE slug = 'cafe-especial-cerrado-mineiro';
    SELECT id_produto INTO v_produto2_id FROM produtos WHERE slug = 'cafe-moido-espresso';
    
    -- Criar pedido
    INSERT INTO pedidos (id_cliente, id_endereco_entrega, numero_pedido, status_pedido, valor_subtotal, valor_desconto, valor_frete, valor_total, metodo_pagamento, status_pagamento)
    VALUES (v_user_id, v_endereco_id, 'PED-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-0001', 'Entregue', 87.80, 0, 15.00, 102.80, 'Cartao_Credito', 'Aprovado')
    RETURNING id_pedido INTO v_pedido_id;
    
    -- Itens do pedido
    INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario_no_pedido, subtotal)
    VALUES 
    (v_pedido_id, v_produto1_id, 1, 45.90, 45.90),
    (v_pedido_id, v_produto2_id, 1, 41.90, 41.90);
    
    -- Histórico
    INSERT INTO historico_status_pedido (id_pedido, status_anterior, status_novo)
    VALUES (v_pedido_id, NULL, 'Confirmado');
    
    INSERT INTO historico_status_pedido (id_pedido, status_anterior, status_novo)
    VALUES (v_pedido_id, 'Confirmado', 'Enviado');
    
    INSERT INTO historico_status_pedido (id_pedido, status_anterior, status_novo)
    VALUES (v_pedido_id, 'Enviado', 'Entregue');
END $$;

-- Pedido 2 - Ana
DO $$
DECLARE
    v_user_id BIGINT;
    v_endereco_id BIGINT;
    v_produto_id BIGINT;
    v_pedido_id BIGINT;
BEGIN
    SELECT id_usuario INTO v_user_id FROM usuarios WHERE email = 'ana@email.com';
    SELECT id_endereco INTO v_endereco_id FROM enderecos WHERE id_usuario = v_user_id LIMIT 1;
    SELECT id_produto INTO v_produto_id FROM produtos WHERE slug = 'cafe-gourmet-mogiana';
    
    INSERT INTO pedidos (id_cliente, id_endereco_entrega, numero_pedido, status_pedido, valor_subtotal, valor_desconto, valor_frete, valor_total, metodo_pagamento, status_pagamento)
    VALUES (v_user_id, v_endereco_id, 'PED-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-0002', 'Em_Preparacao', 42.50, 0, 12.00, 54.50, 'Pix', 'Aprovado')
    RETURNING id_pedido INTO v_pedido_id;
    
    INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario_no_pedido, subtotal)
    VALUES (v_pedido_id, v_produto_id, 1, 42.50, 42.50);
    
    INSERT INTO historico_status_pedido (id_pedido, status_anterior, status_novo)
    VALUES (v_pedido_id, NULL, 'Confirmado');
    
    INSERT INTO historico_status_pedido (id_pedido, status_anterior, status_novo)
    VALUES (v_pedido_id, 'Confirmado', 'Em_Preparacao');
END $$;

-- ============================================
-- CONFIGURAÇÕES DE FRETE
-- ============================================

-- Já existem dados iniciais, mas vamos garantir
INSERT INTO configuracoes_frete (nome_modalidade, tipo_calculo, valor_base, valor_por_kg, prazo_dias, ativo, frete_gratis_acima)
VALUES
('PAC', 'Por_Peso', 15.00, 2.50, 10, true, 150.00),
('SEDEX', 'Por_Peso', 25.00, 5.00, 5, true, 200.00),
('Frete Grátis', 'Tabela_Fixa', 0.00, 0.00, 10, true, 150.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- MENSAGEM FINAL
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Dados de exemplo inseridos com sucesso!';
    RAISE NOTICE 'Usuários criados:';
    RAISE NOTICE '  - admin@sotocafe.com (senha: 123456)';
    RAISE NOTICE '  - joao@email.com (senha: 123456)';
    RAISE NOTICE '  - ana@email.com (senha: 123456)';
    RAISE NOTICE '  - roberto@email.com (senha: 123456)';
    RAISE NOTICE '';
    RAISE NOTICE 'Produtos criados: 9 produtos em 5 categorias';
    RAISE NOTICE 'Cupons disponíveis: BEMVINDO10, FRETEGRATIS, CAFE20';
END $$;


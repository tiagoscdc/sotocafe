-- ============================================
-- SOTO CAFÉ - E-commerce de Cafeteria Gourmet
-- Script de Criação do Banco de Dados
-- PostgreSQL 14+
-- ============================================

-- Criar banco de dados (executar separadamente se necessário)
-- CREATE DATABASE soto_cafe;
-- \c soto_cafe;

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELAS PRINCIPAIS
-- ============================================

-- Tabela: usuarios
CREATE TABLE usuarios (
    id_usuario BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14),
    tipo_usuario VARCHAR(50) NOT NULL DEFAULT 'Cliente' CHECK (tipo_usuario IN ('Cliente', 'Administrador', 'Gerente_Conteudo', 'Expedicao', 'Suporte', 'Barista')),
    status VARCHAR(50) NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Bloqueado')),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_ultimo_acesso TIMESTAMP,
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    token_ativacao VARCHAR(255),
    data_expiracao_token TIMESTAMP
);

CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_status ON usuarios(status);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Tabela: enderecos
CREATE TABLE enderecos (
    id_endereco BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    tipo_endereco VARCHAR(50) NOT NULL DEFAULT 'Residencial' CHECK (tipo_endereco IN ('Residencial', 'Comercial', 'Cobranca')),
    cep VARCHAR(10) NOT NULL,
    rua VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    ponto_referencia VARCHAR(255),
    endereco_principal BOOLEAN NOT NULL DEFAULT FALSE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enderecos_usuario ON enderecos(id_usuario);
CREATE INDEX idx_enderecos_cep ON enderecos(cep);

-- Tabela: categorias
CREATE TABLE categorias (
    id_categoria BIGSERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    id_categoria_pai BIGINT REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    ordem_exibicao INT NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    imagem VARCHAR(255)
);

CREATE INDEX idx_categorias_ativo ON categorias(ativo);
CREATE INDEX idx_categorias_pai ON categorias(id_categoria_pai);

-- Tabela: produtos
CREATE TABLE produtos (
    id_produto BIGSERIAL PRIMARY KEY,
    id_categoria BIGINT NOT NULL REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    nome_produto VARCHAR(255) NOT NULL,
    descricao TEXT,
    descricao_curta VARCHAR(500),
    slug VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario > 0),
    preco_custo DECIMAL(10,2),
    estoque_atual INT NOT NULL DEFAULT 0 CHECK (estoque_atual >= 0),
    estoque_minimo INT NOT NULL DEFAULT 0,
    peso_gramas DECIMAL(10,2) NOT NULL,
    altura_cm DECIMAL(10,2),
    largura_cm DECIMAL(10,2),
    profundidade_cm DECIMAL(10,2),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    origem VARCHAR(100),
    nivel_torra VARCHAR(50),
    notas_sensoriais TEXT,
    tipo_moagem VARCHAR(50)
);

CREATE INDEX idx_produtos_categoria ON produtos(id_categoria);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);
CREATE INDEX idx_produtos_destaque ON produtos(destaque);
CREATE INDEX idx_produtos_sku ON produtos(sku);

-- Tabela: imagens_produto
CREATE TABLE imagens_produto (
    id_imagem BIGSERIAL PRIMARY KEY,
    id_produto BIGINT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    url_imagem VARCHAR(500) NOT NULL,
    ordem INT NOT NULL DEFAULT 0,
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    alt_text VARCHAR(255)
);

CREATE INDEX idx_imagens_produto ON imagens_produto(id_produto);

-- Tabela: carrinho
CREATE TABLE carrinho (
    id_carrinho BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    session_id VARCHAR(255),
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP
);

CREATE INDEX idx_carrinho_usuario ON carrinho(id_usuario);
CREATE INDEX idx_carrinho_session ON carrinho(session_id);

-- Tabela: item_carrinho
CREATE TABLE item_carrinho (
    id_item_carrinho BIGSERIAL PRIMARY KEY,
    id_carrinho BIGINT NOT NULL REFERENCES carrinho(id_carrinho) ON DELETE CASCADE,
    id_produto BIGINT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    data_adicao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_item_carrinho_carrinho ON item_carrinho(id_carrinho);

-- Tabela: cupons_desconto
CREATE TABLE cupons_desconto (
    id_cupom BIGSERIAL PRIMARY KEY,
    codigo_cupom VARCHAR(50) NOT NULL UNIQUE,
    tipo_desconto VARCHAR(50) NOT NULL CHECK (tipo_desconto IN ('Percentual', 'Valor_Fixo')),
    valor_desconto DECIMAL(10,2) NOT NULL CHECK (valor_desconto > 0),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL CHECK (data_fim >= data_inicio),
    limite_usos_total INT,
    limite_usos_por_cliente INT,
    usos_atuais INT NOT NULL DEFAULT 0,
    valor_minimo_pedido DECIMAL(10,2) NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    aplicavel_todos_produtos BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cupons_ativo ON cupons_desconto(ativo);
CREATE INDEX idx_cupons_codigo ON cupons_desconto(codigo_cupom);

-- Tabela: cupom_categoria
CREATE TABLE cupom_categoria (
    id_cupom BIGINT NOT NULL REFERENCES cupons_desconto(id_cupom) ON DELETE CASCADE,
    id_categoria BIGINT NOT NULL REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    PRIMARY KEY (id_cupom, id_categoria)
);

-- Tabela: cupom_produto
CREATE TABLE cupom_produto (
    id_cupom BIGINT NOT NULL REFERENCES cupons_desconto(id_cupom) ON DELETE CASCADE,
    id_produto BIGINT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    PRIMARY KEY (id_cupom, id_produto)
);

-- Tabela: pedidos
CREATE TABLE pedidos (
    id_pedido BIGSERIAL PRIMARY KEY,
    id_cliente BIGINT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    id_endereco_entrega BIGINT NOT NULL REFERENCES enderecos(id_endereco) ON DELETE RESTRICT,
    numero_pedido VARCHAR(50) NOT NULL UNIQUE,
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_pedido VARCHAR(50) NOT NULL DEFAULT 'Confirmado' CHECK (status_pedido IN ('Confirmado', 'Em_Preparacao', 'Enviado', 'Em_Transito', 'Entregue', 'Cancelado')),
    valor_subtotal DECIMAL(10,2) NOT NULL,
    valor_desconto DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_frete DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_total DECIMAL(10,2) NOT NULL CHECK (valor_total > 0),
    metodo_pagamento VARCHAR(50) NOT NULL CHECK (metodo_pagamento IN ('Cartao_Credito', 'Pix', 'Boleto')),
    status_pagamento VARCHAR(50) NOT NULL DEFAULT 'Pendente' CHECK (status_pagamento IN ('Pendente', 'Aprovado', 'Recusado', 'Estornado')),
    id_cupom BIGINT REFERENCES cupons_desconto(id_cupom) ON DELETE SET NULL,
    codigo_rastreamento VARCHAR(100),
    observacoes TEXT,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_pedidos_status ON pedidos(status_pedido);
CREATE INDEX idx_pedidos_data ON pedidos(data_pedido);
CREATE INDEX idx_pedidos_numero ON pedidos(numero_pedido);

-- Tabela: item_pedido
CREATE TABLE item_pedido (
    id_item_pedido BIGSERIAL PRIMARY KEY,
    id_pedido BIGINT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_produto BIGINT NOT NULL REFERENCES produtos(id_produto) ON DELETE RESTRICT,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario_no_pedido DECIMAL(10,2) NOT NULL CHECK (preco_unitario_no_pedido > 0),
    subtotal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_item_pedido_pedido ON item_pedido(id_pedido);

-- Tabela: historico_status_pedido
CREATE TABLE historico_status_pedido (
    id_historico BIGSERIAL PRIMARY KEY,
    id_pedido BIGINT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    data_mudanca TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario BIGINT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    observacoes TEXT
);

CREATE INDEX idx_historico_pedido ON historico_status_pedido(id_pedido);
CREATE INDEX idx_historico_data ON historico_status_pedido(data_mudanca);

-- Tabela: programa_fidelidade
CREATE TABLE programa_fidelidade (
    id_fidelidade BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    saldo_pontos INT NOT NULL DEFAULT 0,
    pontos_totais_ganhos INT NOT NULL DEFAULT 0,
    pontos_totais_resgatados INT NOT NULL DEFAULT 0,
    data_ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fidelidade_usuario ON programa_fidelidade(id_usuario);

-- Tabela: historico_pontos
CREATE TABLE historico_pontos (
    id_historico BIGSERIAL PRIMARY KEY,
    id_fidelidade BIGINT NOT NULL REFERENCES programa_fidelidade(id_fidelidade) ON DELETE CASCADE,
    id_pedido BIGINT REFERENCES pedidos(id_pedido) ON DELETE SET NULL,
    tipo_movimentacao VARCHAR(50) NOT NULL CHECK (tipo_movimentacao IN ('Ganho', 'Resgate', 'Expiracao')),
    pontos INT NOT NULL,
    descricao VARCHAR(255),
    data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historico_pontos_fidelidade ON historico_pontos(id_fidelidade);
CREATE INDEX idx_historico_pontos_data ON historico_pontos(data_movimentacao);

-- Tabela: configuracoes_frete
CREATE TABLE configuracoes_frete (
    id_frete BIGSERIAL PRIMARY KEY,
    nome_modalidade VARCHAR(100) NOT NULL,
    tipo_calculo VARCHAR(50) NOT NULL CHECK (tipo_calculo IN ('Por_Peso', 'Por_CEP', 'Tabela_Fixa')),
    valor_base DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_por_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
    prazo_dias INT NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    frete_gratis_acima DECIMAL(10,2),
    regioes_atendidas JSONB
);

CREATE INDEX idx_frete_ativo ON configuracoes_frete(ativo);

-- Tabela: planos_assinatura
CREATE TABLE planos_assinatura (
    id_plano BIGSERIAL PRIMARY KEY,
    nome_plano VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor_mensal DECIMAL(10,2) NOT NULL,
    quantidade_cafe INT,
    tipo_cafe VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    beneficios JSONB
);

CREATE INDEX idx_planos_ativo ON planos_assinatura(ativo);

-- Tabela: assinaturas
CREATE TABLE assinaturas (
    id_assinatura BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_plano BIGINT NOT NULL REFERENCES planos_assinatura(id_plano) ON DELETE RESTRICT,
    frequencia_entrega VARCHAR(50) NOT NULL DEFAULT 'Mensal' CHECK (frequencia_entrega IN ('Mensal', 'Trimestral', 'Semestral', 'Anual')),
    status VARCHAR(50) NOT NULL DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Pausada', 'Cancelada', 'Expirada')),
    data_inicio DATE NOT NULL,
    data_proxima_entrega DATE,
    data_cancelamento DATE,
    metodo_pagamento VARCHAR(50),
    valor_mensal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_assinaturas_usuario ON assinaturas(id_usuario);
CREATE INDEX idx_assinaturas_status ON assinaturas(status);

-- Tabela: pedidos_assinatura
CREATE TABLE pedidos_assinatura (
    id_pedido_assinatura BIGSERIAL PRIMARY KEY,
    id_assinatura BIGINT NOT NULL REFERENCES assinaturas(id_assinatura) ON DELETE CASCADE,
    id_pedido BIGINT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    data_geracao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Gerado' CHECK (status IN ('Gerado', 'Processado', 'Falhou'))
);

CREATE INDEX idx_pedidos_assinatura ON pedidos_assinatura(id_assinatura);

-- Tabela: kits
CREATE TABLE kits (
    id_kit BIGSERIAL PRIMARY KEY,
    nome_kit VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_base DECIMAL(10,2) NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabela: kit_produto
CREATE TABLE kit_produto (
    id_kit BIGINT NOT NULL REFERENCES kits(id_kit) ON DELETE CASCADE,
    id_produto BIGINT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    quantidade INT NOT NULL DEFAULT 1,
    obrigatorio BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id_kit, id_produto)
);

-- Tabela: lotes_torra
CREATE TABLE lotes_torra (
    id_lote BIGSERIAL PRIMARY KEY,
    codigo_lote VARCHAR(50) NOT NULL UNIQUE,
    tipo_grao VARCHAR(100),
    origem VARCHAR(100),
    data_torra DATE NOT NULL,
    peso_inicial_kg DECIMAL(10,2),
    peso_final_kg DECIMAL(10,2),
    nivel_torra VARCHAR(50),
    temperatura_torra DECIMAL(5,2),
    tempo_torra INT,
    observacoes TEXT,
    id_barista BIGINT REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE INDEX idx_lotes_codigo ON lotes_torra(codigo_lote);
CREATE INDEX idx_lotes_data ON lotes_torra(data_torra);

-- Tabela: lote_produto
CREATE TABLE lote_produto (
    id_lote BIGINT NOT NULL REFERENCES lotes_torra(id_lote) ON DELETE CASCADE,
    id_produto BIGINT NOT NULL REFERENCES produtos(id_produto) ON DELETE CASCADE,
    quantidade_kg DECIMAL(10,2),
    PRIMARY KEY (id_lote, id_produto)
);

-- Tabela: artigos_blog
CREATE TABLE artigos_blog (
    id_artigo BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    conteudo TEXT NOT NULL,
    resumo VARCHAR(500),
    imagem_destaque VARCHAR(500),
    autor VARCHAR(100),
    data_publicacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Rascunho' CHECK (status IN ('Rascunho', 'Publicado', 'Arquivado')),
    categoria VARCHAR(100),
    tags JSONB,
    visualizacoes INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_artigos_slug ON artigos_blog(slug);
CREATE INDEX idx_artigos_status ON artigos_blog(status);
CREATE INDEX idx_artigos_data ON artigos_blog(data_publicacao);

-- Tabela: faq
CREATE TABLE faq (
    id_faq BIGSERIAL PRIMARY KEY,
    pergunta VARCHAR(500) NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(100),
    ordem INT NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    visualizacoes INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_faq_categoria ON faq(categoria);
CREATE INDEX idx_faq_ativo ON faq(ativo);

-- Tabela: notificacoes_email
CREATE TABLE notificacoes_email (
    id_notificacao BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    tipo VARCHAR(50) NOT NULL,
    destinatario VARCHAR(255) NOT NULL,
    assunto VARCHAR(255) NOT NULL,
    corpo TEXT NOT NULL,
    data_envio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Enviado', 'Falhou', 'Pendente')),
    id_pedido BIGINT REFERENCES pedidos(id_pedido) ON DELETE SET NULL
);

CREATE INDEX idx_notificacoes_usuario ON notificacoes_email(id_usuario);
CREATE INDEX idx_notificacoes_tipo ON notificacoes_email(tipo);
CREATE INDEX idx_notificacoes_status ON notificacoes_email(status);

-- ============================================
-- TRIGGERS E FUNÇÕES
-- ============================================

-- Função para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para produtos
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para pedidos
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar número de pedido único
CREATE OR REPLACE FUNCTION gerar_numero_pedido()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_pedido IS NULL OR NEW.numero_pedido = '' THEN
        NEW.numero_pedido := 'PED-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(NEXTVAL('pedidos_id_pedido_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para gerar número de pedido
CREATE TRIGGER gerar_numero_pedido_trigger BEFORE INSERT ON pedidos
    FOR EACH ROW EXECUTE FUNCTION gerar_numero_pedido();

-- ============================================
-- DADOS INICIAIS (SEEDS)
-- ============================================

-- Inserir usuário administrador padrão (senha: admin123 - hash deve ser gerado pela aplicação)
-- INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, status, email_verificado)
-- VALUES ('Administrador', 'admin@sotocafe.com', '$2b$10$...', 'Administrador', 'Ativo', TRUE);

-- Inserir categorias iniciais
INSERT INTO categorias (nome_categoria, slug, ordem_exibicao, ativo) VALUES
('Cafés em Grão', 'cafes-grao', 1, TRUE),
('Cafés Moídos', 'cafes-moidos', 2, TRUE),
('Cápsulas', 'capsulas', 3, TRUE),
('Acessórios', 'acessorios', 4, TRUE),
('Kits', 'kits', 5, TRUE);

-- Inserir configurações de frete padrão
INSERT INTO configuracoes_frete (nome_modalidade, tipo_calculo, valor_base, valor_por_kg, prazo_dias, ativo) VALUES
('PAC', 'Por_Peso', 15.00, 2.50, 10, TRUE),
('SEDEX', 'Por_Peso', 25.00, 5.00, 5, TRUE),
('Frete Grátis', 'Tabela_Fixa', 0.00, 0.00, 10, TRUE);

-- ============================================
-- FIM DO SCRIPT
-- ============================================


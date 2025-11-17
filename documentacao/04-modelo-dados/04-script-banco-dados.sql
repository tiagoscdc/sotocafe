-- Script de Criação do Banco de Dados
-- Soto Café - E-commerce de Cafeteria Gourmet
-- Versão: 1.0
-- Autor: Tiago Soares Carneiro da Cunha
-- RGM: 44030509

-- ============================================
-- Criação do Banco de Dados
-- ============================================

CREATE DATABASE IF NOT EXISTS sotocafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sotocafe;

-- ============================================
-- Tabela: usuarios
-- ============================================

CREATE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14),
    tipo_usuario ENUM('Cliente', 'Administrador', 'Gerente_Conteudo', 'Expedicao', 'Suporte', 'Barista') DEFAULT 'Cliente',
    status ENUM('Ativo', 'Inativo', 'Bloqueado') DEFAULT 'Ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultimo_acesso TIMESTAMP NULL,
    email_verificado BOOLEAN DEFAULT FALSE,
    token_ativacao VARCHAR(255),
    data_expiracao_token TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_tipo_usuario (tipo_usuario),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: enderecos
-- ============================================

CREATE TABLE enderecos (
    id_endereco BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    tipo_endereco ENUM('Residencial', 'Comercial', 'Cobranca') DEFAULT 'Residencial',
    cep VARCHAR(10) NOT NULL,
    rua VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    ponto_referencia VARCHAR(255),
    endereco_principal BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_cep (cep)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: categorias
-- ============================================

CREATE TABLE categorias (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    slug VARCHAR(100) NOT NULL UNIQUE,
    id_categoria_pai BIGINT NULL,
    ordem_exibicao INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    imagem VARCHAR(255),
    FOREIGN KEY (id_categoria_pai) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: produtos
-- ============================================

CREATE TABLE produtos (
    id_produto BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_categoria BIGINT NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    descricao TEXT,
    descricao_curta VARCHAR(500),
    slug VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    preco_custo DECIMAL(10, 2),
    estoque_atual INT DEFAULT 0,
    estoque_minimo INT DEFAULT 0,
    peso_gramas DECIMAL(10, 2) NOT NULL,
    altura_cm DECIMAL(10, 2),
    largura_cm DECIMAL(10, 2),
    profundidade_cm DECIMAL(10, 2),
    ativo BOOLEAN DEFAULT TRUE,
    destaque BOOLEAN DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    origem VARCHAR(100),
    nivel_torra VARCHAR(50),
    notas_sensoriais TEXT,
    tipo_moagem VARCHAR(50),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    INDEX idx_categoria (id_categoria),
    INDEX idx_sku (sku),
    INDEX idx_slug (slug),
    INDEX idx_ativo (ativo),
    INDEX idx_destaque (destaque),
    CHECK (preco_unitario > 0),
    CHECK (estoque_atual >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: imagens_produto
-- ============================================

CREATE TABLE imagens_produto (
    id_imagem BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_produto BIGINT NOT NULL,
    url_imagem VARCHAR(500) NOT NULL,
    ordem INT DEFAULT 0,
    principal BOOLEAN DEFAULT FALSE,
    alt_text VARCHAR(255),
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE,
    INDEX idx_produto (id_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: carrinho
-- ============================================

CREATE TABLE carrinho (
    id_carrinho BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NULL,
    session_id VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: item_carrinho
-- ============================================

CREATE TABLE item_carrinho (
    id_item_carrinho BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_carrinho BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    quantidade INT NOT NULL,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_carrinho) REFERENCES carrinho(id_carrinho) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE,
    INDEX idx_carrinho (id_carrinho),
    CHECK (quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: cupons_desconto
-- ============================================

CREATE TABLE cupons_desconto (
    id_cupom BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_cupom VARCHAR(50) NOT NULL UNIQUE,
    tipo_desconto ENUM('Percentual', 'Valor_Fixo') NOT NULL,
    valor_desconto DECIMAL(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    limite_usos_total INT NULL,
    limite_usos_por_cliente INT NULL,
    usos_atuais INT DEFAULT 0,
    valor_minimo_pedido DECIMAL(10, 2) DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    aplicavel_todos_produtos BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo_cupom),
    INDEX idx_ativo (ativo),
    CHECK (valor_desconto > 0),
    CHECK (data_fim >= data_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: cupom_categoria
-- ============================================

CREATE TABLE cupom_categoria (
    id_cupom BIGINT NOT NULL,
    id_categoria BIGINT NOT NULL,
    PRIMARY KEY (id_cupom, id_categoria),
    FOREIGN KEY (id_cupom) REFERENCES cupons_desconto(id_cupom) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: cupom_produto
-- ============================================

CREATE TABLE cupom_produto (
    id_cupom BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    PRIMARY KEY (id_cupom, id_produto),
    FOREIGN KEY (id_cupom) REFERENCES cupons_desconto(id_cupom) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: pedidos
-- ============================================

CREATE TABLE pedidos (
    id_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente BIGINT NOT NULL,
    id_endereco_entrega BIGINT NOT NULL,
    numero_pedido VARCHAR(50) NOT NULL UNIQUE,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_pedido ENUM('Confirmado', 'Em_Preparacao', 'Enviado', 'Em_Transito', 'Entregue', 'Cancelado') DEFAULT 'Confirmado',
    valor_subtotal DECIMAL(10, 2) NOT NULL,
    valor_desconto DECIMAL(10, 2) DEFAULT 0,
    valor_frete DECIMAL(10, 2) DEFAULT 0,
    valor_total DECIMAL(10, 2) NOT NULL,
    metodo_pagamento ENUM('Cartao_Credito', 'Pix', 'Boleto') NOT NULL,
    status_pagamento ENUM('Pendente', 'Aprovado', 'Recusado', 'Estornado') DEFAULT 'Pendente',
    id_cupom BIGINT NULL,
    codigo_rastreamento VARCHAR(100),
    observacoes TEXT,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_endereco_entrega) REFERENCES enderecos(id_endereco) ON DELETE RESTRICT,
    FOREIGN KEY (id_cupom) REFERENCES cupons_desconto(id_cupom) ON DELETE SET NULL,
    INDEX idx_cliente (id_cliente),
    INDEX idx_numero_pedido (numero_pedido),
    INDEX idx_status_pedido (status_pedido),
    INDEX idx_data_pedido (data_pedido),
    CHECK (valor_total > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: item_pedido
-- ============================================

CREATE TABLE item_pedido (
    id_item_pedido BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario_no_pedido DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE RESTRICT,
    INDEX idx_pedido (id_pedido),
    CHECK (quantidade > 0),
    CHECK (preco_unitario_no_pedido > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: historico_status_pedido
-- ============================================

CREATE TABLE historico_status_pedido (
    id_historico BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    data_mudanca TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario BIGINT NULL,
    observacoes TEXT,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_pedido (id_pedido),
    INDEX idx_data (data_mudanca)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: programa_fidelidade
-- ============================================

CREATE TABLE programa_fidelidade (
    id_fidelidade BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE,
    saldo_pontos INT DEFAULT 0,
    pontos_totais_ganhos INT DEFAULT 0,
    pontos_totais_resgatados INT DEFAULT 0,
    data_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: historico_pontos
-- ============================================

CREATE TABLE historico_pontos (
    id_historico BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_fidelidade BIGINT NOT NULL,
    id_pedido BIGINT NULL,
    tipo_movimentacao ENUM('Ganho', 'Resgate', 'Expiracao') NOT NULL,
    pontos INT NOT NULL,
    descricao VARCHAR(255),
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_fidelidade) REFERENCES programa_fidelidade(id_fidelidade) ON DELETE CASCADE,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE SET NULL,
    INDEX idx_fidelidade (id_fidelidade),
    INDEX idx_data (data_movimentacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: configuracoes_frete
-- ============================================

CREATE TABLE configuracoes_frete (
    id_frete BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_modalidade VARCHAR(100) NOT NULL,
    tipo_calculo ENUM('Por_Peso', 'Por_CEP', 'Tabela_Fixa') NOT NULL,
    valor_base DECIMAL(10, 2) DEFAULT 0,
    valor_por_kg DECIMAL(10, 2) DEFAULT 0,
    prazo_dias INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    frete_gratis_acima DECIMAL(10, 2) NULL,
    regioes_atendidas JSON,
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: planos_assinatura
-- ============================================

CREATE TABLE planos_assinatura (
    id_plano BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_plano VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor_mensal DECIMAL(10, 2) NOT NULL,
    quantidade_cafe INT,
    tipo_cafe VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    beneficios JSON,
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: assinaturas
-- ============================================

CREATE TABLE assinaturas (
    id_assinatura BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_plano BIGINT NOT NULL,
    frequencia_entrega ENUM('Mensal', 'Trimestral', 'Semestral', 'Anual') DEFAULT 'Mensal',
    status ENUM('Ativa', 'Pausada', 'Cancelada', 'Expirada') DEFAULT 'Ativa',
    data_inicio DATE NOT NULL,
    data_proxima_entrega DATE,
    data_cancelamento DATE NULL,
    metodo_pagamento VARCHAR(50),
    valor_mensal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_plano) REFERENCES planos_assinatura(id_plano) ON DELETE RESTRICT,
    INDEX idx_usuario (id_usuario),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: pedidos_assinatura
-- ============================================

CREATE TABLE pedidos_assinatura (
    id_pedido_assinatura BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_assinatura BIGINT NOT NULL,
    id_pedido BIGINT NOT NULL,
    data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Gerado', 'Processado', 'Falhou') DEFAULT 'Gerado',
    FOREIGN KEY (id_assinatura) REFERENCES assinaturas(id_assinatura) ON DELETE CASCADE,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    INDEX idx_assinatura (id_assinatura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: kits
-- ============================================

CREATE TABLE kits (
    id_kit BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome_kit VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_base DECIMAL(10, 2) DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: kit_produto
-- ============================================

CREATE TABLE kit_produto (
    id_kit BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    quantidade INT DEFAULT 1,
    obrigatorio BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_kit, id_produto),
    FOREIGN KEY (id_kit) REFERENCES kits(id_kit) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: lotes_torra
-- ============================================

CREATE TABLE lotes_torra (
    id_lote BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_lote VARCHAR(50) NOT NULL UNIQUE,
    tipo_grao VARCHAR(100),
    origem VARCHAR(100),
    data_torra DATE NOT NULL,
    peso_inicial_kg DECIMAL(10, 2),
    peso_final_kg DECIMAL(10, 2),
    nivel_torra VARCHAR(50),
    temperatura_torra DECIMAL(5, 2),
    tempo_torra INT,
    observacoes TEXT,
    id_barista BIGINT NULL,
    FOREIGN KEY (id_barista) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_codigo (codigo_lote),
    INDEX idx_data (data_torra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: lote_produto
-- ============================================

CREATE TABLE lote_produto (
    id_lote BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    quantidade_kg DECIMAL(10, 2),
    PRIMARY KEY (id_lote, id_produto),
    FOREIGN KEY (id_lote) REFERENCES lotes_torra(id_lote) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: artigos_blog
-- ============================================

CREATE TABLE artigos_blog (
    id_artigo BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    conteudo TEXT NOT NULL,
    resumo VARCHAR(500),
    imagem_destaque VARCHAR(500),
    autor VARCHAR(100),
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('Rascunho', 'Publicado', 'Arquivado') DEFAULT 'Rascunho',
    categoria VARCHAR(100),
    tags JSON,
    visualizacoes INT DEFAULT 0,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_data_publicacao (data_publicacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: faq
-- ============================================

CREATE TABLE faq (
    id_faq BIGINT AUTO_INCREMENT PRIMARY KEY,
    pergunta VARCHAR(500) NOT NULL,
    resposta TEXT NOT NULL,
    categoria VARCHAR(100),
    ordem INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    visualizacoes INT DEFAULT 0,
    INDEX idx_categoria (categoria),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabela: notificacoes_email
-- ============================================

CREATE TABLE notificacoes_email (
    id_notificacao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NULL,
    tipo VARCHAR(50) NOT NULL,
    destinatario VARCHAR(255) NOT NULL,
    assunto VARCHAR(255) NOT NULL,
    corpo TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Enviado', 'Falhou', 'Pendente') DEFAULT 'Pendente',
    id_pedido BIGINT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE SET NULL,
    INDEX idx_usuario (id_usuario),
    INDEX idx_tipo (tipo),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Fim do Script
-- ============================================


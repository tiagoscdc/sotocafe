-- ============================================
-- SOTO CAFÉ - Schema SQLite
-- Banco de dados em arquivo (não precisa instalar PostgreSQL)
-- ============================================

-- Habilitar foreign keys
PRAGMA foreign_keys = ON;

-- ============================================
-- TABELAS PRINCIPAIS
-- ============================================

-- Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    telefone TEXT,
    cpf TEXT,
    tipo_usuario TEXT NOT NULL DEFAULT 'Cliente' CHECK (tipo_usuario IN ('Cliente', 'Administrador', 'Gerente_Conteudo', 'Expedicao', 'Suporte', 'Barista')),
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Bloqueado')),
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_ultimo_acesso DATETIME,
    email_verificado INTEGER NOT NULL DEFAULT 0,
    token_ativacao TEXT,
    data_expiracao_token DATETIME
);

CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Tabela: enderecos
CREATE TABLE IF NOT EXISTS enderecos (
    id_endereco INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    tipo_endereco TEXT NOT NULL DEFAULT 'Residencial' CHECK (tipo_endereco IN ('Residencial', 'Comercial', 'Cobranca')),
    cep TEXT NOT NULL,
    rua TEXT NOT NULL,
    numero TEXT NOT NULL,
    complemento TEXT,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    ponto_referencia TEXT,
    endereco_principal INTEGER NOT NULL DEFAULT 0,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_enderecos_usuario ON enderecos(id_usuario);
CREATE INDEX IF NOT EXISTS idx_enderecos_cep ON enderecos(cep);

-- Tabela: categorias
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_categoria TEXT NOT NULL,
    descricao TEXT,
    slug TEXT NOT NULL UNIQUE,
    id_categoria_pai INTEGER,
    ordem_exibicao INTEGER NOT NULL DEFAULT 0,
    ativo INTEGER NOT NULL DEFAULT 1,
    imagem TEXT,
    FOREIGN KEY (id_categoria_pai) REFERENCES categorias(id_categoria) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias(ativo);
CREATE INDEX IF NOT EXISTS idx_categorias_pai ON categorias(id_categoria_pai);

-- Tabela: produtos
CREATE TABLE IF NOT EXISTS produtos (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER NOT NULL,
    nome_produto TEXT NOT NULL,
    descricao TEXT,
    descricao_curta TEXT,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    preco_unitario REAL NOT NULL CHECK (preco_unitario > 0),
    preco_custo REAL,
    estoque_atual INTEGER NOT NULL DEFAULT 0 CHECK (estoque_atual >= 0),
    estoque_minimo INTEGER NOT NULL DEFAULT 0,
    peso_gramas REAL NOT NULL,
    altura_cm REAL,
    largura_cm REAL,
    profundidade_cm REAL,
    ativo INTEGER NOT NULL DEFAULT 1,
    destaque INTEGER NOT NULL DEFAULT 0,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    origem TEXT,
    nivel_torra TEXT,
    notas_sensoriais TEXT,
    tipo_moagem TEXT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(id_categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos(destaque);
CREATE INDEX IF NOT EXISTS idx_produtos_sku ON produtos(sku);

-- Tabela: imagens_produto
CREATE TABLE IF NOT EXISTS imagens_produto (
    id_imagem INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL,
    url_imagem TEXT NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 0,
    principal INTEGER NOT NULL DEFAULT 0,
    alt_text TEXT,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_imagens_produto ON imagens_produto(id_produto);

-- Tabela: carrinho
CREATE TABLE IF NOT EXISTS carrinho (
    id_carrinho INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    session_id TEXT,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_carrinho_usuario ON carrinho(id_usuario);
CREATE INDEX IF NOT EXISTS idx_carrinho_session ON carrinho(session_id);

-- Tabela: item_carrinho
CREATE TABLE IF NOT EXISTS item_carrinho (
    id_item_carrinho INTEGER PRIMARY KEY AUTOINCREMENT,
    id_carrinho INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    data_adicao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_carrinho) REFERENCES carrinho(id_carrinho) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_item_carrinho_carrinho ON item_carrinho(id_carrinho);

-- Tabela: cupons_desconto
CREATE TABLE IF NOT EXISTS cupons_desconto (
    id_cupom INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_cupom TEXT NOT NULL UNIQUE,
    tipo_desconto TEXT NOT NULL CHECK (tipo_desconto IN ('Percentual', 'Valor_Fixo')),
    valor_desconto REAL NOT NULL CHECK (valor_desconto > 0),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    limite_usos_total INTEGER,
    limite_usos_por_cliente INTEGER,
    usos_atuais INTEGER NOT NULL DEFAULT 0,
    valor_minimo_pedido REAL NOT NULL DEFAULT 0,
    ativo INTEGER NOT NULL DEFAULT 1,
    aplicavel_todos_produtos INTEGER NOT NULL DEFAULT 1,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (data_fim >= data_inicio)
);

CREATE INDEX IF NOT EXISTS idx_cupons_ativo ON cupons_desconto(ativo);
CREATE INDEX IF NOT EXISTS idx_cupons_codigo ON cupons_desconto(codigo_cupom);

-- Tabela: cupom_categoria
CREATE TABLE IF NOT EXISTS cupom_categoria (
    id_cupom INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_cupom, id_categoria),
    FOREIGN KEY (id_cupom) REFERENCES cupons_desconto(id_cupom) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
);

-- Tabela: cupom_produto
CREATE TABLE IF NOT EXISTS cupom_produto (
    id_cupom INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    PRIMARY KEY (id_cupom, id_produto),
    FOREIGN KEY (id_cupom) REFERENCES cupons_desconto(id_cupom) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

-- Tabela: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_endereco_entrega INTEGER NOT NULL,
    numero_pedido TEXT NOT NULL UNIQUE,
    data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_pedido TEXT NOT NULL DEFAULT 'Confirmado' CHECK (status_pedido IN ('Confirmado', 'Em_Preparacao', 'Enviado', 'Em_Transito', 'Entregue', 'Cancelado')),
    valor_subtotal REAL NOT NULL,
    valor_desconto REAL NOT NULL DEFAULT 0,
    valor_frete REAL NOT NULL DEFAULT 0,
    valor_total REAL NOT NULL CHECK (valor_total > 0),
    metodo_pagamento TEXT NOT NULL CHECK (metodo_pagamento IN ('Cartao_Credito', 'Pix', 'Boleto')),
    status_pagamento TEXT NOT NULL DEFAULT 'Pendente' CHECK (status_pagamento IN ('Pendente', 'Aprovado', 'Recusado', 'Estornado')),
    id_cupom INTEGER,
    codigo_rastreamento TEXT,
    observacoes TEXT,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_endereco_entrega) REFERENCES enderecos(id_endereco) ON DELETE RESTRICT,
    FOREIGN KEY (id_cupom) REFERENCES cupons_desconto(id_cupom) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status_pedido);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(data_pedido);
CREATE INDEX IF NOT EXISTS idx_pedidos_numero ON pedidos(numero_pedido);

-- Tabela: item_pedido
CREATE TABLE IF NOT EXISTS item_pedido (
    id_item_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario_no_pedido REAL NOT NULL CHECK (preco_unitario_no_pedido > 0),
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_item_pedido_pedido ON item_pedido(id_pedido);

-- Tabela: historico_status_pedido
CREATE TABLE IF NOT EXISTS historico_status_pedido (
    id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    status_anterior TEXT,
    status_novo TEXT NOT NULL,
    data_mudanca DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER,
    observacoes TEXT,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_historico_pedido ON historico_status_pedido(id_pedido);
CREATE INDEX IF NOT EXISTS idx_historico_data ON historico_status_pedido(data_mudanca);

-- Tabela: programa_fidelidade
CREATE TABLE IF NOT EXISTS programa_fidelidade (
    id_fidelidade INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL UNIQUE,
    saldo_pontos INTEGER NOT NULL DEFAULT 0,
    pontos_totais_ganhos INTEGER NOT NULL DEFAULT 0,
    pontos_totais_resgatados INTEGER NOT NULL DEFAULT 0,
    data_ultima_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fidelidade_usuario ON programa_fidelidade(id_usuario);

-- Tabela: historico_pontos
CREATE TABLE IF NOT EXISTS historico_pontos (
    id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
    id_fidelidade INTEGER NOT NULL,
    id_pedido INTEGER,
    tipo_movimentacao TEXT NOT NULL CHECK (tipo_movimentacao IN ('Ganho', 'Resgate', 'Expiracao')),
    pontos INTEGER NOT NULL,
    descricao TEXT,
    data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_fidelidade) REFERENCES programa_fidelidade(id_fidelidade) ON DELETE CASCADE,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_historico_pontos_fidelidade ON historico_pontos(id_fidelidade);
CREATE INDEX IF NOT EXISTS idx_historico_pontos_data ON historico_pontos(data_movimentacao);

-- Tabela: configuracoes_frete
CREATE TABLE IF NOT EXISTS configuracoes_frete (
    id_frete INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_modalidade TEXT NOT NULL,
    tipo_calculo TEXT NOT NULL CHECK (tipo_calculo IN ('Por_Peso', 'Por_CEP', 'Tabela_Fixa')),
    valor_base REAL NOT NULL DEFAULT 0,
    valor_por_kg REAL NOT NULL DEFAULT 0,
    prazo_dias INTEGER NOT NULL DEFAULT 0,
    ativo INTEGER NOT NULL DEFAULT 1,
    frete_gratis_acima REAL,
    regioes_atendidas TEXT
);

CREATE INDEX IF NOT EXISTS idx_frete_ativo ON configuracoes_frete(ativo);

-- Tabela: planos_assinatura
CREATE TABLE IF NOT EXISTS planos_assinatura (
    id_plano INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_plano TEXT NOT NULL,
    descricao TEXT,
    valor_mensal REAL NOT NULL,
    quantidade_cafe INTEGER,
    tipo_cafe TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    beneficios TEXT
);

CREATE INDEX IF NOT EXISTS idx_planos_ativo ON planos_assinatura(ativo);

-- Tabela: assinaturas
CREATE TABLE IF NOT EXISTS assinaturas (
    id_assinatura INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_plano INTEGER NOT NULL,
    frequencia_entrega TEXT NOT NULL DEFAULT 'Mensal' CHECK (frequencia_entrega IN ('Mensal', 'Trimestral', 'Semestral', 'Anual')),
    status TEXT NOT NULL DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Pausada', 'Cancelada', 'Expirada')),
    data_inicio DATE NOT NULL,
    data_proxima_entrega DATE,
    data_cancelamento DATE,
    metodo_pagamento TEXT,
    valor_mensal REAL NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_plano) REFERENCES planos_assinatura(id_plano) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario ON assinaturas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);

-- Tabela: pedidos_assinatura
CREATE TABLE IF NOT EXISTS pedidos_assinatura (
    id_pedido_assinatura INTEGER PRIMARY KEY AUTOINCREMENT,
    id_assinatura INTEGER NOT NULL,
    id_pedido INTEGER NOT NULL,
    data_geracao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'Gerado' CHECK (status IN ('Gerado', 'Processado', 'Falhou')),
    FOREIGN KEY (id_assinatura) REFERENCES assinaturas(id_assinatura) ON DELETE CASCADE,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pedidos_assinatura ON pedidos_assinatura(id_assinatura);

-- Tabela: kits
CREATE TABLE IF NOT EXISTS kits (
    id_kit INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_kit TEXT NOT NULL,
    descricao TEXT,
    preco_base REAL NOT NULL DEFAULT 0,
    ativo INTEGER NOT NULL DEFAULT 1
);

-- Tabela: kit_produto
CREATE TABLE IF NOT EXISTS kit_produto (
    id_kit INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    obrigatorio INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id_kit, id_produto),
    FOREIGN KEY (id_kit) REFERENCES kits(id_kit) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

-- Tabela: lotes_torra
CREATE TABLE IF NOT EXISTS lotes_torra (
    id_lote INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_lote TEXT NOT NULL UNIQUE,
    tipo_grao TEXT,
    origem TEXT,
    data_torra DATE NOT NULL,
    peso_inicial_kg REAL,
    peso_final_kg REAL,
    nivel_torra TEXT,
    temperatura_torra REAL,
    tempo_torra INTEGER,
    observacoes TEXT,
    id_barista INTEGER,
    FOREIGN KEY (id_barista) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_lotes_codigo ON lotes_torra(codigo_lote);
CREATE INDEX IF NOT EXISTS idx_lotes_data ON lotes_torra(data_torra);

-- Tabela: lote_produto
CREATE TABLE IF NOT EXISTS lote_produto (
    id_lote INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade_kg REAL,
    PRIMARY KEY (id_lote, id_produto),
    FOREIGN KEY (id_lote) REFERENCES lotes_torra(id_lote) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

-- Tabela: artigos_blog
CREATE TABLE IF NOT EXISTS artigos_blog (
    id_artigo INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    conteudo TEXT NOT NULL,
    resumo TEXT,
    imagem_destaque TEXT,
    autor TEXT,
    data_publicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'Rascunho' CHECK (status IN ('Rascunho', 'Publicado', 'Arquivado')),
    categoria TEXT,
    tags TEXT,
    visualizacoes INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_artigos_slug ON artigos_blog(slug);
CREATE INDEX IF NOT EXISTS idx_artigos_status ON artigos_blog(status);
CREATE INDEX IF NOT EXISTS idx_artigos_data ON artigos_blog(data_publicacao);

-- Tabela: faq
CREATE TABLE IF NOT EXISTS faq (
    id_faq INTEGER PRIMARY KEY AUTOINCREMENT,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    categoria TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    ativo INTEGER NOT NULL DEFAULT 1,
    visualizacoes INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_faq_categoria ON faq(categoria);
CREATE INDEX IF NOT EXISTS idx_faq_ativo ON faq(ativo);

-- Tabela: notificacoes_email
CREATE TABLE IF NOT EXISTS notificacoes_email (
    id_notificacao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    tipo TEXT NOT NULL,
    destinatario TEXT NOT NULL,
    assunto TEXT NOT NULL,
    corpo TEXT NOT NULL,
    data_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Enviado', 'Falhou', 'Pendente')),
    id_pedido INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes_email(id_usuario);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON notificacoes_email(tipo);
CREATE INDEX IF NOT EXISTS idx_notificacoes_status ON notificacoes_email(status);

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Categorias
INSERT OR IGNORE INTO categorias (nome_categoria, slug, ordem_exibicao, ativo) VALUES
('Cafés em Grão', 'cafes-grao', 1, 1),
('Cafés Moídos', 'cafes-moidos', 2, 1),
('Cápsulas', 'capsulas', 3, 1),
('Acessórios', 'acessorios', 4, 1),
('Kits', 'kits', 5, 1);

-- Configurações de frete
INSERT OR IGNORE INTO configuracoes_frete (nome_modalidade, tipo_calculo, valor_base, valor_por_kg, prazo_dias, ativo) VALUES
('PAC', 'Por_Peso', 15.00, 2.50, 10, 1),
('SEDEX', 'Por_Peso', 25.00, 5.00, 5, 1),
('Frete Grátis', 'Tabela_Fixa', 0.00, 0.00, 10, 1);


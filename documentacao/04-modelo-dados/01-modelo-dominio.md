# Modelo de Domínio
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha

---

## 1. Introdução

Este documento descreve o modelo de domínio do sistema Soto Café, identificando as entidades de negócio fundamentais, seus atributos e relacionamentos.

---

## 2. Entidades Principais

### 2.1 Usuário

Representa todos os usuários do sistema (clientes, administradores, funcionários).

**Atributos:**
- `id_usuario` (PK): Identificador único
- `nome`: Nome completo do usuário
- `email`: E-mail (único)
- `senha_hash`: Hash da senha (criptografada)
- `telefone`: Telefone de contato
- `cpf`: CPF (opcional, para clientes)
- `tipo_usuario`: Enum (Cliente, Administrador, Gerente_Conteudo, Expedicao, Suporte, Barista)
- `status`: Enum (Ativo, Inativo, Bloqueado)
- `data_cadastro`: Data e hora do cadastro
- `data_ultimo_acesso`: Data e hora do último acesso
- `email_verificado`: Boolean (se e-mail foi confirmado)
- `token_ativacao`: Token para ativação de conta
- `data_expiracao_token`: Data de expiração do token

**Relacionamentos:**
- Possui muitos Endereços (1:N)
- Faz muitos Pedidos (1:N)
- Possui um ProgramaFidelidade (1:1)
- Possui muitos CuponsUtilizados (1:N)

---

### 2.2 Endereco

Representa endereços de entrega e cobrança dos usuários.

**Atributos:**
- `id_endereco` (PK): Identificador único
- `id_usuario` (FK): Referência ao usuário
- `tipo_endereco`: Enum (Residencial, Comercial, Cobranca)
- `cep`: CEP
- `rua`: Logradouro
- `numero`: Número
- `complemento`: Complemento (opcional)
- `bairro`: Bairro
- `cidade`: Cidade
- `estado`: Estado (UF)
- `ponto_referencia`: Ponto de referência (opcional)
- `endereco_principal`: Boolean (endereço padrão)
- `data_cadastro`: Data de cadastro

**Relacionamentos:**
- Pertence a um Usuário (N:1)
- Usado em muitos Pedidos (1:N)

---

### 2.3 Categoria

Representa categorias de produtos.

**Atributos:**
- `id_categoria` (PK): Identificador único
- `nome_categoria`: Nome da categoria
- `descricao`: Descrição da categoria
- `slug`: URL amigável
- `id_categoria_pai` (FK): Referência à categoria pai (para subcategorias)
- `ordem_exibicao`: Ordem de exibição no menu
- `ativo`: Boolean (se categoria está ativa)
- `imagem`: URL da imagem da categoria

**Relacionamentos:**
- Possui muitos Produtos (1:N)
- Pode ter CategoriaPai (N:1) - auto-relacionamento

---

### 2.4 Produto

Representa produtos do catálogo (cafés, acessórios, kits).

**Atributos:**
- `id_produto` (PK): Identificador único
- `id_categoria` (FK): Referência à categoria
- `nome_produto`: Nome do produto
- `descricao`: Descrição detalhada
- `descricao_curta`: Descrição resumida
- `slug`: URL amigável
- `sku`: Código SKU único
- `preco_unitario`: Preço de venda
- `preco_custo`: Preço de custo (opcional)
- `estoque_atual`: Quantidade em estoque
- `estoque_minimo`: Estoque mínimo para alerta
- `peso_gramas`: Peso em gramas
- `altura_cm`: Altura em centímetros
- `largura_cm`: Largura em centímetros
- `profundidade_cm`: Profundidade em centímetros
- `ativo`: Boolean (se produto está ativo)
- `destaque`: Boolean (se produto está em destaque)
- `data_cadastro`: Data de cadastro
- `data_atualizacao`: Data da última atualização
- `origem`: Origem do café (opcional)
- `nivel_torra`: Nível de torra (opcional)
- `notas_sensoriais`: Notas sensoriais (opcional)
- `tipo_moagem`: Tipo de moagem (opcional)

**Relacionamentos:**
- Pertence a uma Categoria (N:1)
- Aparece em muitos ItemPedido (1:N)
- Possui muitas ImagensProduto (1:N)
- Pode estar em muitos Kits (N:M)
- Pode estar em muitos LotesTorra (N:M)

---

### 2.5 ImagemProduto

Representa imagens dos produtos.

**Atributos:**
- `id_imagem` (PK): Identificador único
- `id_produto` (FK): Referência ao produto
- `url_imagem`: URL da imagem
- `ordem`: Ordem de exibição
- `principal`: Boolean (imagem principal)
- `alt_text`: Texto alternativo para acessibilidade

**Relacionamentos:**
- Pertence a um Produto (N:1)

---

### 2.6 Pedido

Representa pedidos realizados pelos clientes.

**Atributos:**
- `id_pedido` (PK): Identificador único
- `id_cliente` (FK): Referência ao cliente
- `id_endereco_entrega` (FK): Referência ao endereço de entrega
- `numero_pedido`: Número único do pedido (gerado)
- `data_pedido`: Data e hora do pedido
- `status_pedido`: Enum (Confirmado, Em_Preparacao, Enviado, Em_Transito, Entregue, Cancelado)
- `valor_subtotal`: Valor dos produtos
- `valor_desconto`: Valor do desconto (cupom)
- `valor_frete`: Valor do frete
- `valor_total`: Valor total do pedido
- `metodo_pagamento`: Enum (Cartao_Credito, Pix, Boleto)
- `status_pagamento`: Enum (Pendente, Aprovado, Recusado, Estornado)
- `id_cupom` (FK): Referência ao cupom utilizado (opcional)
- `codigo_rastreamento`: Código de rastreamento da transportadora
- `observacoes`: Observações do cliente
- `data_atualizacao`: Data da última atualização

**Relacionamentos:**
- Pertence a um Usuário (Cliente) (N:1)
- Usa um Endereco (N:1)
- Contém muitos ItemPedido (1:N)
- Pode usar um CupomDesconto (N:1)
- Possui muitos HistoricoStatusPedido (1:N)

---

### 2.7 ItemPedido

Representa um item (produto) dentro de um pedido.

**Atributos:**
- `id_item_pedido` (PK): Identificador único
- `id_pedido` (FK): Referência ao pedido
- `id_produto` (FK): Referência ao produto
- `quantidade`: Quantidade do produto
- `preco_unitario_no_pedido`: Preço unitário no momento da compra
- `subtotal`: Subtotal do item (quantidade × preço)

**Relacionamentos:**
- Pertence a um Pedido (N:1)
- Referencia um Produto (N:1)

---

### 2.8 HistoricoStatusPedido

Representa o histórico de mudanças de status de um pedido.

**Atributos:**
- `id_historico` (PK): Identificador único
- `id_pedido` (FK): Referência ao pedido
- `status_anterior`: Status anterior
- `status_novo`: Novo status
- `data_mudanca`: Data e hora da mudança
- `id_usuario` (FK): Usuário que alterou (opcional, para alterações manuais)
- `observacoes`: Observações sobre a mudança

**Relacionamentos:**
- Pertence a um Pedido (N:1)
- Pode ter um Usuário (N:1)

---

### 2.9 Carrinho

Representa o carrinho de compras de um cliente (sessão ou persistente).

**Atributos:**
- `id_carrinho` (PK): Identificador único
- `id_usuario` (FK): Referência ao usuário (opcional, para carrinho persistente)
- `session_id`: ID da sessão (para carrinho não autenticado)
- `data_criacao`: Data de criação
- `data_atualizacao`: Data da última atualização
- `data_expiracao`: Data de expiração (24h)

**Relacionamentos:**
- Pertence a um Usuário (N:1) - opcional
- Contém muitos ItemCarrinho (1:N)

---

### 2.10 ItemCarrinho

Representa um item no carrinho de compras.

**Atributos:**
- `id_item_carrinho` (PK): Identificador único
- `id_carrinho` (FK): Referência ao carrinho
- `id_produto` (FK): Referência ao produto
- `quantidade`: Quantidade do produto
- `data_adicao`: Data de adição ao carrinho

**Relacionamentos:**
- Pertence a um Carrinho (N:1)
- Referencia um Produto (N:1)

---

### 2.11 CupomDesconto

Representa cupons de desconto.

**Atributos:**
- `id_cupom` (PK): Identificador único
- `codigo_cupom`: Código único do cupom
- `tipo_desconto`: Enum (Percentual, Valor_Fixo)
- `valor_desconto`: Valor do desconto (percentual ou fixo)
- `data_inicio`: Data de início da validade
- `data_fim`: Data de fim da validade
- `limite_usos_total`: Limite total de usos (opcional)
- `limite_usos_por_cliente`: Limite de usos por cliente (opcional)
- `usos_atuais`: Número de usos atuais
- `valor_minimo_pedido`: Valor mínimo do pedido para usar o cupom
- `ativo`: Boolean (se cupom está ativo)
- `aplicavel_todos_produtos`: Boolean
- `data_criacao`: Data de criação

**Relacionamentos:**
- Usado em muitos Pedidos (1:N)
- Pode ser aplicável a Categorias (N:M)
- Pode ser aplicável a Produtos (N:M)

---

### 2.12 CupomCategoria

Tabela de relacionamento entre cupons e categorias (quando cupom é aplicável apenas a certas categorias).

**Atributos:**
- `id_cupom` (FK): Referência ao cupom
- `id_categoria` (FK): Referência à categoria

---

### 2.13 CupomProduto

Tabela de relacionamento entre cupons e produtos (quando cupom é aplicável apenas a certos produtos).

**Atributos:**
- `id_cupom` (FK): Referência ao cupom
- `id_produto` (FK): Referência ao produto

---

### 2.14 ProgramaFidelidade

Representa o programa de pontos de fidelidade de um cliente.

**Atributos:**
- `id_fidelidade` (PK): Identificador único
- `id_usuario` (FK): Referência ao usuário
- `saldo_pontos`: Saldo atual de pontos
- `pontos_totais_ganhos`: Total de pontos ganhos (histórico)
- `pontos_totais_resgatados`: Total de pontos resgatados (histórico)
- `data_ultima_atualizacao`: Data da última atualização
- `data_cadastro`: Data de cadastro no programa

**Relacionamentos:**
- Pertence a um Usuário (1:1)
- Possui muitos HistoricoPontos (1:N)

---

### 2.15 HistoricoPontos

Representa o histórico de ganhos e resgates de pontos.

**Atributos:**
- `id_historico` (PK): Identificador único
- `id_fidelidade` (FK): Referência ao programa de fidelidade
- `id_pedido` (FK): Referência ao pedido (se pontos ganhos por compra)
- `tipo_movimentacao`: Enum (Ganho, Resgate, Expiracao)
- `pontos`: Quantidade de pontos
- `descricao`: Descrição da movimentação
- `data_movimentacao`: Data e hora da movimentação

**Relacionamentos:**
- Pertence a um ProgramaFidelidade (N:1)
- Pode ter um Pedido (N:1)

---

### 2.16 ConfiguracaoFrete

Representa configurações de modalidades de frete.

**Atributos:**
- `id_frete` (PK): Identificador único
- `nome_modalidade`: Nome da modalidade (ex: PAC, SEDEX)
- `tipo_calculo`: Enum (Por_Peso, Por_CEP, Tabela_Fixa)
- `valor_base`: Valor base do frete
- `valor_por_kg`: Valor por quilograma adicional
- `prazo_dias`: Prazo estimado em dias
- `ativo`: Boolean
- `frete_gratis_acima`: Valor mínimo para frete grátis (opcional)
- `regioes_atendidas`: JSON com regiões atendidas

**Relacionamentos:**
- Usado em muitos Pedidos (1:N)

---

### 2.17 Assinatura

Representa assinaturas do clube de café.

**Atributos:**
- `id_assinatura` (PK): Identificador único
- `id_usuario` (FK): Referência ao usuário
- `id_plano` (FK): Referência ao plano de assinatura
- `frequencia_entrega`: Enum (Mensal, Trimestral, Semestral, Anual)
- `status`: Enum (Ativa, Pausada, Cancelada, Expirada)
- `data_inicio`: Data de início
- `data_proxima_entrega`: Data da próxima entrega
- `data_cancelamento`: Data de cancelamento (opcional)
- `metodo_pagamento`: Método de pagamento recorrente
- `valor_mensal`: Valor mensal da assinatura

**Relacionamentos:**
- Pertence a um Usuário (N:1)
- Referencia um PlanoAssinatura (N:1)
- Gera muitos PedidosAssinatura (1:N)

---

### 2.18 PlanoAssinatura

Representa planos de assinatura disponíveis.

**Atributos:**
- `id_plano` (PK): Identificador único
- `nome_plano`: Nome do plano
- `descricao`: Descrição do plano
- `valor_mensal`: Valor mensal
- `quantidade_cafe`: Quantidade de café incluída
- `tipo_cafe`: Tipo de café (opcional)
- `ativo`: Boolean
- `beneficios`: JSON com benefícios do plano

---

### 2.19 PedidoAssinatura

Representa pedidos gerados automaticamente por assinaturas.

**Atributos:**
- `id_pedido_assinatura` (PK): Identificador único
- `id_assinatura` (FK): Referência à assinatura
- `id_pedido` (FK): Referência ao pedido gerado
- `data_geracao`: Data de geração do pedido
- `status`: Enum (Gerado, Processado, Falhou)

**Relacionamentos:**
- Pertence a uma Assinatura (N:1)
- Referencia um Pedido (1:1)

---

### 2.20 Kit

Representa kits de presente personalizáveis.

**Atributos:**
- `id_kit` (PK): Identificador único
- `nome_kit`: Nome do kit
- `descricao`: Descrição
- `preco_base`: Preço base (da embalagem)
- `ativo`: Boolean

**Relacionamentos:**
- Contém muitos Produtos (N:M) - através de KitProduto

---

### 2.21 KitProduto

Tabela de relacionamento entre kits e produtos.

**Atributos:**
- `id_kit` (FK): Referência ao kit
- `id_produto` (FK): Referência ao produto
- `quantidade`: Quantidade do produto no kit
- `obrigatorio`: Boolean (se produto é obrigatório no kit)

---

### 2.22 LoteTorra

Representa lotes de café torrado (se torrefação for interna).

**Atributos:**
- `id_lote` (PK): Identificador único
- `codigo_lote`: Código único do lote
- `tipo_grao`: Tipo de grão
- `origem`: Origem do grão
- `data_torra`: Data da torra
- `peso_inicial_kg`: Peso antes da torra
- `peso_final_kg`: Peso após a torra
- `nivel_torra`: Nível de torra
- `temperatura_torra`: Temperatura da torra (opcional)
- `tempo_torra`: Tempo de torra (opcional)
- `observacoes`: Observações
- `id_barista` (FK): Barista responsável

**Relacionamentos:**
- Criado por um Usuário (Barista) (N:1)
- Pode estar associado a Produtos (N:M)

---

### 2.23 LoteProduto

Tabela de relacionamento entre lotes de torra e produtos (para rastreabilidade).

**Atributos:**
- `id_lote` (FK): Referência ao lote
- `id_produto` (FK): Referência ao produto
- `quantidade_kg`: Quantidade em kg do produto associado ao lote

---

### 2.24 ArtigoBlog

Representa artigos do blog.

**Atributos:**
- `id_artigo` (PK): Identificador único
- `titulo`: Título do artigo
- `slug`: URL amigável
- `conteudo`: Conteúdo do artigo (HTML/Markdown)
- `resumo`: Resumo do artigo
- `imagem_destaque`: URL da imagem de destaque
- `autor`: Nome do autor
- `data_publicacao`: Data de publicação
- `data_atualizacao`: Data da última atualização
- `status`: Enum (Rascunho, Publicado, Arquivado)
- `categoria`: Categoria do artigo
- `tags`: Tags (JSON ou texto)
- `visualizacoes`: Número de visualizações

---

### 2.25 FAQ

Representa perguntas frequentes.

**Atributos:**
- `id_faq` (PK): Identificador único
- `pergunta`: Pergunta
- `resposta`: Resposta
- `categoria`: Categoria da FAQ
- `ordem`: Ordem de exibição
- `ativo`: Boolean
- `visualizacoes`: Número de visualizações

---

### 2.26 NotificacaoEmail

Representa histórico de e-mails enviados.

**Atributos:**
- `id_notificacao` (PK): Identificador único
- `id_usuario` (FK): Referência ao usuário
- `tipo`: Enum (Confirmacao_Cadastro, Confirmacao_Pedido, Mudanca_Status, etc.)
- `destinatario`: E-mail do destinatário
- `assunto`: Assunto do e-mail
- `corpo`: Corpo do e-mail
- `data_envio`: Data e hora do envio
- `status`: Enum (Enviado, Falhou, Pendente)
- `id_pedido` (FK): Referência ao pedido (se aplicável)

**Relacionamentos:**
- Enviado para um Usuário (N:1)
- Pode estar relacionado a um Pedido (N:1)

---

## 3. Diagrama de Relacionamentos

### 3.1 Relacionamentos Principais

```
Usuário (1) ────< (N) Endereco
Usuário (1) ────< (N) Pedido
Usuário (1) ──── (1) ProgramaFidelidade

Categoria (1) ────< (N) Produto
Produto (1) ────< (N) ImagemProduto
Produto (1) ────< (N) ItemPedido
Produto (N) ──── (N) Kit (através de KitProduto)

Pedido (1) ────< (N) ItemPedido
Pedido (1) ────< (N) HistoricoStatusPedido
Pedido (N) ──── (1) CupomDesconto

Carrinho (1) ────< (N) ItemCarrinho

Assinatura (1) ────< (N) PedidoAssinatura
Assinatura (N) ──── (1) PlanoAssinatura
```

---

## 4. Regras de Negócio do Modelo

### 4.1 Integridade Referencial

- Quando um usuário é removido, seus pedidos devem ser mantidos (soft delete ou histórico)
- Quando um produto é removido, itens de pedidos históricos devem manter referência
- Quando um pedido é cancelado, estoque deve ser revertido

### 4.2 Validações

- E-mail de usuário deve ser único
- SKU de produto deve ser único
- Código de cupom deve ser único
- Número de pedido deve ser único
- Código de lote deve ser único

### 4.3 Triggers e Constraints

- Estoque não pode ser negativo
- Preço de produto deve ser maior que zero
- Quantidade em pedido/item deve ser maior que zero
- Data de fim de cupom deve ser maior que data de início

---

## 5. Índices Recomendados

### 5.1 Índices Primários
- Todas as chaves primárias (PK)

### 5.2 Índices Únicos
- `usuario.email`
- `produto.sku`
- `cupom.codigo_cupom`
- `pedido.numero_pedido`

### 5.3 Índices de Performance
- `pedido.id_cliente`
- `pedido.status_pedido`
- `pedido.data_pedido`
- `produto.id_categoria`
- `produto.ativo`
- `item_pedido.id_pedido`
- `carrinho.id_usuario`
- `carrinho.session_id`

---

## 6. Considerações de Implementação

### 6.1 Soft Delete

Algumas entidades devem usar soft delete (marcar como inativo ao invés de deletar):
- Usuário
- Produto
- Categoria
- Pedido (manter histórico)

### 6.2 Auditoria

Entidades críticas devem ter campos de auditoria:
- `data_criacao`
- `data_atualizacao`
- `usuario_criacao` (opcional)
- `usuario_atualizacao` (opcional)

### 6.3 Versionamento

Para entidades que podem mudar ao longo do tempo (ex: preço de produto), considerar:
- Tabela de histórico de preços
- Manter preço no momento da compra em ItemPedido

---

## 7. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Criar diagrama ER visual
- Gerar scripts SQL de criação das tabelas
- Definir estratégia de migração de dados


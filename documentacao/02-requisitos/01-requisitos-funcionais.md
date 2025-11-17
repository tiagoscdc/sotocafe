# Requisitos Funcionais
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha

---

## 1. Introdução

Este documento descreve os requisitos funcionais do sistema Soto Café, organizados por módulos e funcionalidades. Cada requisito está relacionado às histórias de usuário definidas no projeto.

---

## 2. Módulo: Gestão de Contas e Acesso

### RF-001: Cadastro de Usuário

**História de Usuário:** HU-01  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que novos usuários se cadastrem na plataforma.

**Requisitos Detalhados:**

1. O sistema deve exibir um formulário de cadastro com os seguintes campos:
   - Nome Completo (obrigatório)
   - E-mail (obrigatório, formato válido)
   - Senha (obrigatório, mínimo 8 caracteres)
   - Confirmação de Senha (obrigatório)

2. O sistema deve validar:
   - E-mail único (não pode estar cadastrado)
   - Senha com no mínimo 8 caracteres, incluindo letras, números e pelo menos um caractere especial
   - Confirmação de senha deve ser igual à senha

3. O sistema deve criptografar a senha antes de armazenar no banco de dados

4. Após o cadastro, o sistema deve enviar um e-mail de confirmação com link de ativação

5. O usuário deve ativar a conta através do link recebido por e-mail

6. Após a ativação, o usuário deve conseguir fazer login

**Regras de Negócio:**
- RN-001: E-mail deve ser único por usuário
- RN-002: Senha deve ser criptografada (hash) antes do armazenamento
- RN-003: Conta inativa não pode fazer login

**Requisitos Não Funcionais:**
- RNF-001: Processo de cadastro deve ser concluído em até 5 segundos
- RNF-002: Dados devem ser transmitidos via HTTPS
- RNF-003: E-mail de confirmação deve ser enviado em até 1 minuto

---

### RF-002: Autenticação de Usuário

**História de Usuário:** HU-01  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que usuários cadastrados façam login.

**Requisitos Detalhados:**

1. O sistema deve exibir um formulário de login com:
   - E-mail
   - Senha

2. O sistema deve validar as credenciais fornecidas

3. O sistema deve manter a sessão do usuário autenticado

4. O sistema deve redirecionar o usuário para a página inicial após login bem-sucedido

5. O sistema deve exibir mensagem de erro para credenciais inválidas

**Regras de Negócio:**
- RN-004: Apenas contas ativas podem fazer login
- RN-005: Após 5 tentativas de login falhadas, a conta deve ser bloqueada temporariamente

**Requisitos Não Funcionais:**
- RNF-004: Processo de login deve ser concluído em até 2 segundos
- RNF-005: Sessão deve expirar após 30 minutos de inatividade

---

### RF-003: Gerenciamento de Usuários e Permissões

**História de Usuário:** HU-24  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que administradores gerenciem usuários e suas permissões.

**Requisitos Detalhados:**

1. O administrador deve poder:
   - Visualizar lista de usuários (clientes e funcionários)
   - Criar novos usuários internos (funcionários)
   - Editar informações de usuários
   - Desativar/ativar contas de usuários
   - Atribuir perfis de permissão (Administrador, Gerente de Conteúdo, Expedição, Suporte, Barista)

2. O sistema deve ter os seguintes perfis:
   - **Cliente**: Acesso apenas ao e-commerce
   - **Administrador**: Acesso total ao sistema
   - **Gerente de Conteúdo**: Gerenciar produtos, categorias, blog, FAQ
   - **Expedição**: Gerenciar pedidos para separação e envio
   - **Suporte**: Visualizar pedidos e histórico de clientes
   - **Barista/Produção**: Registrar lotes de torra

3. O sistema deve registrar auditoria de ações realizadas por usuários internos

**Regras de Negócio:**
- RN-006: Apenas administradores podem gerenciar outros administradores
- RN-007: Cada perfil tem acesso restrito a funcionalidades específicas

---

## 3. Módulo: Navegação e Catálogo de Produtos

### RF-004: Navegação por Categorias

**História de Usuário:** HU-02  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que clientes naveguem por categorias de produtos.

**Requisitos Detalhados:**

1. O sistema deve exibir um menu de categorias na navegação principal

2. As categorias principais devem incluir:
   - Grãos
   - Moído
   - Cápsulas
   - Kits
   - Acessórios

3. Ao clicar em uma categoria, o sistema deve listar os produtos dessa categoria

4. O sistema deve permitir aplicar filtros:
   - Por subcategoria
   - Por origem do café
   - Por nível de torra
   - Por tipo de moagem
   - Por faixa de preço

5. O sistema deve permitir ordenar produtos por:
   - Relevância
   - Preço (menor para maior, maior para menor)
   - Nome (A-Z, Z-A)
   - Mais vendidos

6. Produtos sem estoque devem ser exibidos com etiqueta "Indisponível" ou não aparecer (configurável)

**Regras de Negócio:**
- RN-008: A categorização deve seguir a estrutura definida pela gestão de estoque
- RN-009: Produtos sem estoque podem ser exibidos ou ocultados (configuração administrativa)

**Requisitos Não Funcionais:**
- RNF-006: Página de categoria deve carregar em até 2 segundos
- RNF-007: Navegação deve funcionar corretamente em desktop, tablet e mobile

---

### RF-005: Gerenciamento de Catálogo de Produtos

**História de Usuário:** HU-05  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que administradores gerenciem o catálogo de produtos.

**Requisitos Detalhados:**

1. O administrador deve poder:
   - Adicionar novos produtos
   - Editar produtos existentes
   - Remover produtos (com confirmação)
   - Gerenciar imagens dos produtos
   - Atualizar preços e estoque

2. Ao adicionar/editar produto, o sistema deve coletar:
   - Nome do produto (obrigatório)
   - Descrição (obrigatório)
   - Preço unitário (obrigatório, numérico)
   - Categoria (obrigatório)
   - Estoque atual (obrigatório, numérico)
   - Peso em gramas (obrigatório)
   - Dimensões (opcional)
   - Imagens (mínimo 1, máximo 5)
   - Variações (tipo de moagem, peso, etc.)
   - Informações adicionais (origem, notas sensoriais, nível de torra)

3. O sistema deve validar:
   - Preço deve ser numérico e maior que zero
   - Estoque não pode ser negativo
   - Categoria deve existir

4. As alterações devem ser refletidas imediatamente no site

**Regras de Negócio:**
- RN-010: Apenas usuários com perfil "Administrador" ou "Gerente de Conteúdo" podem gerenciar produtos
- RN-011: Produtos removidos não devem aparecer no site, mas dados históricos são mantidos

**Requisitos Não Funcionais:**
- RNF-008: Interface de gerenciamento deve ser responsiva
- RNF-009: Upload de imagens deve ser otimizado

---

### RF-006: Busca de Produtos

**História de Usuário:** HU-15  
**Prioridade:** Média

**Descrição:** O sistema deve permitir que clientes busquem produtos através de uma barra de pesquisa.

**Requisitos Detalhados:**

1. O sistema deve exibir uma barra de pesquisa visível em todas as páginas

2. Ao digitar na barra de pesquisa, o sistema deve exibir sugestões (autocomplete) de produtos

3. Os resultados da busca devem considerar:
   - Nome do produto
   - Descrição do produto
   - Categoria
   - Tags/palavras-chave

4. A página de resultados deve exibir:
   - Lista de produtos relevantes
   - Opções de filtros
   - Opções de ordenação

5. O sistema deve usar algoritmo de relevância para ordenar resultados

**Regras de Negócio:**
- RN-012: Busca deve considerar nomes, descrições e categorias
- RN-013: Resultados devem ser ordenados por relevância

**Requisitos Não Funcionais:**
- RNF-010: Busca deve ser quase instantânea (menos de 1 segundo)
- RNF-011: Sistema deve suportar grande volume de dados e requisições

---

## 4. Módulo: Carrinho e Checkout

### RF-007: Gerenciamento de Carrinho de Compras

**História de Usuário:** HU-03  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que clientes adicionem produtos ao carrinho e gerenciem os itens.

**Requisitos Detalhados:**

1. O sistema deve permitir adicionar produtos ao carrinho:
   - Da página de detalhes do produto
   - Da página de listagem (se configurado)

2. Ao adicionar produto, o sistema deve:
   - Exibir confirmação visual (pop-up ou atualização de ícone)
   - Validar disponibilidade em estoque
   - Atualizar contador do carrinho

3. O carrinho deve exibir:
   - Lista de produtos adicionados
   - Quantidade de cada item
   - Preço unitário
   - Subtotal por item
   - Subtotal geral

4. O sistema deve permitir:
   - Ajustar quantidade de itens
   - Remover itens do carrinho
   - Limpar carrinho

5. O carrinho deve ser persistente (salvo por 24h ou até finalizar compra)

**Regras de Negócio:**
- RN-014: Não é possível adicionar quantidade maior que a disponível em estoque
- RN-015: Preço no carrinho deve refletir o preço atual de venda

**Requisitos Não Funcionais:**
- RNF-012: Adição ao carrinho deve ser quase instantânea (menos de 1 segundo)
- RNF-013: Carrinho deve ser persistente mesmo após fechar navegador

---

### RF-008: Aplicação de Cupons de Desconto

**História de Usuário:** HU-06  
**Prioridade:** Média

**Descrição:** O sistema deve permitir que clientes apliquem cupons de desconto no carrinho.

**Requisitos Detalhados:**

1. O sistema deve exibir um campo para inserir código de cupom no carrinho ou checkout

2. Ao inserir um código válido, o sistema deve:
   - Validar o cupom (validade, limite de uso, aplicabilidade)
   - Aplicar o desconto
   - Atualizar o valor total do pedido

3. O sistema deve exibir mensagem de erro para cupons:
   - Inválidos
   - Expirados
   - Com limite de uso excedido
   - Já utilizados pelo cliente (se aplicável)

4. O sistema deve permitir remover cupom aplicado

**Regras de Negócio:**
- RN-016: Cupons têm validade (data início e fim) e limite de uso
- RN-017: Cupons podem ser percentuais (ex: 10% OFF) ou valor fixo (ex: R$20 OFF)
- RN-018: Cupons podem ser aplicáveis a categorias específicas ou valor total
- RN-019: Cada cupom pode ser usado apenas uma vez por cliente (se configurado)

**Requisitos Não Funcionais:**
- RNF-014: Validação e aplicação de cupom deve ocorrer em menos de 1 segundo

---

### RF-009: Cálculo e Visualização de Frete

**História de Usuário:** HU-07  
**Prioridade:** Alta

**Descrição:** O sistema deve calcular e exibir opções de frete para o CEP informado.

**Requisitos Detalhados:**

1. No carrinho ou checkout, o sistema deve exibir campo para inserir CEP

2. Após inserir CEP, o sistema deve:
   - Validar formato do CEP
   - Calcular opções de frete disponíveis
   - Exibir modalidades (PAC, SEDEX, Motoboy, etc.) com:
     - Nome da modalidade
     - Valor do frete
     - Prazo estimado de entrega

3. O cliente deve poder selecionar a modalidade desejada

4. O valor do frete selecionado deve ser somado ao total do pedido

5. Para CEPs não atendidos, o sistema deve exibir mensagem informativa

**Regras de Negócio:**
- RN-020: Valores e prazos devem ser calculados com base em tabelas de transportadoras ou regras configuradas
- RN-021: Cálculo pode considerar peso, dimensões e CEP origem/destino
- RN-022: Pode haver regra de frete grátis acima de determinado valor

**Requisitos Não Funcionais:**
- RNF-015: Cálculo e exibição de frete deve ocorrer em no máximo 2 segundos
- RNF-016: Sistema deve integrar com APIs de cálculo de frete de transportadoras

---

### RF-010: Processamento de Pagamento

**História de Usuário:** HU-08  
**Prioridade:** Alta

**Descrição:** O sistema deve processar pagamentos de forma segura através de múltiplos métodos.

**Requisitos Detalhados:**

1. O sistema deve oferecer as seguintes opções de pagamento:
   - **Cartão de Crédito**: Visa, Mastercard, Elo, Amex
   - **Pix**: Geração de QR Code e código Copia e Cola
   - **Boleto Bancário**: Geração de boleto para impressão/download

2. Para **Cartão de Crédito**, o sistema deve coletar:
   - Número do cartão
   - Nome do titular
   - Data de validade
   - CVV
   - CPF do titular (se necessário)

3. Para **Pix**, o sistema deve:
   - Gerar QR Code
   - Gerar código Copia e Cola
   - Aguardar confirmação do pagamento
   - Atualizar status do pedido automaticamente

4. Para **Boleto**, o sistema deve:
   - Gerar boleto bancário
   - Permitir impressão ou download
   - Aguardar compensação (prazo de 1-3 dias úteis)

5. Após confirmação do pagamento, o sistema deve:
   - Exibir mensagem de sucesso
   - Redirecionar para página de confirmação
   - Enviar e-mail de confirmação
   - Atualizar estoque

**Regras de Negócio:**
- RN-023: Integração com gateway deve seguir padrões PCI-DSS
- RN-024: Pagamentos Pix e Cartão têm validação em tempo real
- RN-025: Boleto tem prazo de compensação

**Requisitos Não Funcionais:**
- RNF-017: Página de pagamento deve ter certificado SSL válido (HTTPS)
- RNF-018: Processamento de Pix e Cartão deve ser otimizado (< 3 segundos)
- RNF-019: Integração com gateway deve ter alta disponibilidade

---

## 5. Módulo: Pós-Venda e Fidelidade

### RF-011: Acompanhamento de Status do Pedido

**História de Usuário:** HU-04  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que clientes acompanhem o status de seus pedidos.

**Requisitos Detalhados:**

1. O cliente logado deve ter acesso à seção "Meus Pedidos"

2. A lista de pedidos deve exibir:
   - Número do pedido
   - Data do pedido
   - Valor total
   - Status atual

3. Ao clicar em um pedido, o sistema deve exibir:
   - Detalhamento completo do pedido
   - Histórico de mudanças de status (com data/hora)
   - Código de rastreamento (se enviado)
   - Itens do pedido
   - Endereço de entrega
   - Método de pagamento

4. Os status possíveis são:
   - Confirmado
   - Em Preparação
   - Enviado
   - Em Trânsito
   - Entregue
   - Cancelado

5. O sistema deve enviar notificações por e-mail a cada mudança de status importante

**Regras de Negócio:**
- RN-026: Atualização de status pode ser manual (equipe) ou automática (integração transportadora)
- RN-027: Apenas pedidos "Enviado" ou superior devem exibir código de rastreamento

**Requisitos Não Funcionais:**
- RNF-020: Página "Meus Pedidos" deve carregar em até 3 segundos
- RNF-021: Sistema de notificações por e-mail deve ter alta disponibilidade

---

### RF-012: Confirmação de Pedido por E-mail

**História de Usuário:** HU-09  
**Prioridade:** Alta

**Descrição:** O sistema deve enviar e-mail de confirmação após a compra.

**Requisitos Detalhados:**

1. Após finalização bem-sucedida do pedido, o sistema deve enviar e-mail de confirmação

2. O e-mail deve conter:
   - Número do pedido
   - Lista de produtos comprados
   - Quantidades
   - Valor total
   - Valor do frete
   - Endereço de entrega
   - Método de pagamento
   - Link para acompanhamento do pedido

3. O template do e-mail deve ser padronizado e conter logo da cafeteria

**Regras de Negócio:**
- RN-028: E-mail deve ser enviado somente após confirmação do pagamento (ou geração do boleto)

**Requisitos Não Funcionais:**
- RNF-022: E-mail deve ser enviado em até 1 minuto após aprovação do pagamento
- RNF-023: Serviço de e-mail deve ter alta taxa de entrega (não cair em spam)

---

### RF-013: Programa de Fidelidade

**História de Usuário:** HU-10  
**Prioridade:** Média

**Descrição:** O sistema deve gerenciar programa de pontos de fidelidade.

**Requisitos Detalhados:**

1. O sistema deve exibir saldo de pontos do cliente em seu perfil

2. Após cada compra concluída, o sistema deve:
   - Calcular pontos baseado no valor gasto
   - Adicionar pontos ao saldo do cliente
   - Notificar o cliente sobre os pontos ganhos

3. O cliente deve poder resgatar pontos por:
   - Descontos em compras futuras
   - Produtos específicos (se configurado)

4. O sistema deve exibir histórico de:
   - Pontos ganhos
   - Pontos resgatados
   - Pontos expirados (se aplicável)

**Regras de Negócio:**
- RN-029: Regra de conversão de valor para pontos deve ser configurável (ex: R$1 = 1 ponto)
- RN-030: Regra de resgate deve ser configurável (ex: 100 pontos = R$5 de desconto)
- RN-031: Pontos podem ter validade (configurável)

**Requisitos Não Funcionais:**
- RNF-024: Atualização de saldo deve ser em tempo real após conclusão da compra
- RNF-025: Sistema deve ser escalável para suportar grande volume de transações

---

## 6. Módulo: Funcionalidades Adicionais

### RF-014: Kits de Presente Personalizáveis

**História de Usuário:** HU-11  
**Prioridade:** Média

**Descrição:** O sistema deve permitir que clientes montem kits de presente personalizados.

**Requisitos Detalhados:**

1. O site deve ter uma seção "Kits de Presente" ou "Monte seu Kit"

2. O cliente deve poder:
   - Selecionar uma base (caixa, cesta)
   - Adicionar produtos de diferentes categorias (cafés, xícaras, acessórios)
   - Visualizar preview do kit
   - Adicionar mensagem personalizada

3. O preço do kit deve ser atualizado dinamicamente conforme itens são adicionados

4. O kit montado deve ser adicionado ao carrinho como um item único

**Regras de Negócio:**
- RN-032: Seleção de itens pode ser limitada a produtos específicos ou categorias
- RN-033: Pode haver preço mínimo ou máximo para kits personalizados

**Requisitos Não Funcionais:**
- RNF-026: Interface de montagem deve ser visualmente atraente e fácil de usar
- RNF-027: Experiência em mobile deve ser fluida

---

### RF-015: Clube de Assinatura

**História de Usuário:** HU-16  
**Prioridade:** Média

**Descrição:** O sistema deve gerenciar assinaturas recorrentes de café.

**Requisitos Detalhados:**

1. O site deve ter uma seção "Clube de Assinatura" com diferentes planos:
   - Mensal
   - Trimestral
   - Semestral
   - Anual

2. O cliente deve poder:
   - Selecionar um plano
   - Escolher frequência de entrega
   - Selecionar tipo de café (se aplicável)
   - Realizar pagamento recorrente

3. O sistema deve:
   - Gerenciar cobranças recorrentes
   - Notificar sobre falhas no pagamento
   - Permitir pausar, cancelar ou mudar plano

4. O cliente deve poder gerenciar sua assinatura em seu perfil

**Regras de Negócio:**
- RN-034: Planos de assinatura devem ser configuráveis (preço, frequência, tipo de café)
- RN-035: Sistema deve gerenciar pagamentos recorrentes e notificar sobre falhas

**Requisitos Não Funcionais:**
- RNF-028: Processo de assinatura deve ser intuitivo e rápido
- RNF-029: Plataforma deve suportar cobrança recorrente de forma segura

---

### RF-016: FAQ (Perguntas Frequentes)

**História de Usuário:** HU-12  
**Prioridade:** Baixa

**Descrição:** O sistema deve exibir seção de perguntas frequentes.

**Requisitos Detalhados:**

1. O site deve ter link para seção FAQ (rodapé ou menu de ajuda)

2. A FAQ deve ser organizada por categorias:
   - Pedidos
   - Envio
   - Produtos
   - Pagamento
   - Programa de Fidelidade

3. O sistema deve permitir busca por termos específicos dentro da FAQ

4. As respostas devem ser claras e concisas

5. O conteúdo da FAQ deve ser gerenciável pelo administrador

**Requisitos Não Funcionais:**
- RNF-030: Página FAQ deve carregar rapidamente
- RNF-031: Busca na FAQ deve ser eficiente

---

### RF-017: Blog de Conteúdo

**História de Usuário:** HU-13  
**Prioridade:** Baixa

**Descrição:** O sistema deve exibir blog com artigos sobre café.

**Requisitos Detalhados:**

1. O site deve ter link visível para o blog

2. O blog deve exibir:
   - Lista de artigos com títulos e miniaturas
   - Data de publicação
   - Autor
   - Categorias/Tags

3. Cada artigo deve ter:
   - Título
   - Conteúdo formatado
   - Imagens/Vídeos
   - Opções de compartilhamento social

4. O conteúdo do blog deve ser gerenciável através de CMS

**Requisitos Não Funcionais:**
- RNF-032: Páginas do blog devem ser otimizadas para SEO
- RNF-033: Carregamento das páginas deve ser rápido

---

## 7. Módulo: Gestão e Operações (Backoffice)

### RF-018: Painel de Controle de Vendas

**História de Usuário:** HU-18  
**Prioridade:** Alta

**Descrição:** O sistema deve exibir painel com métricas de vendas para administradores.

**Requisitos Detalhados:**

1. O painel deve exibir métricas chave:
   - Número de pedidos (dia, semana, mês, ano)
   - Faturamento total
   - Ticket médio
   - Produtos mais vendidos
   - Clientes novos
   - Taxa de conversão

2. Os dados devem ser visualizados por períodos:
   - Hoje
   - Semana atual
   - Mês atual
   - Ano atual
   - Período customizado

3. O painel deve conter gráficos para visualização:
   - Gráfico de vendas ao longo do tempo
   - Gráfico de produtos mais vendidos
   - Gráfico de categorias mais vendidas

**Regras de Negócio:**
- RN-036: Apenas usuários com perfil "Administrador" podem acessar o painel
- RN-037: Cálculo das métricas deve ser preciso e refletir dados transacionais

**Requisitos Não Funcionais:**
- RNF-034: Painel deve carregar em até 3 segundos
- RNF-035: Gráficos devem ser interativos e fáceis de entender

---

### RF-019: Gerenciamento de Pedidos

**História de Usuário:** HU-20  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir que administradores gerenciem pedidos.

**Requisitos Detalhados:**

1. O administrador deve ter acesso a lista de todos os pedidos com filtros:
   - Por status
   - Por data
   - Por cliente
   - Por valor

2. Ao clicar em um pedido, o administrador deve ver:
   - Detalhes completos do pedido
   - Informações do cliente
   - Endereço de entrega
   - Histórico de status
   - Informações de pagamento

3. O administrador deve poder:
   - Alterar status do pedido manualmente
   - Cancelar pedido
   - Iniciar processo de estorno (se aplicável)
   - Emitir nota fiscal ou comprovante

**Regras de Negócio:**
- RN-038: Apenas administradores ou funcionários de expedição podem alterar status
- RN-039: Emissão de notas fiscais deve seguir legislação vigente

**Requisitos Não Funcionais:**
- RNF-036: Listagem e detalhamento devem ser rápidos
- RNF-037: Interface deve ser intuitiva

---

### RF-020: Gerenciamento de Cupons

**História de Usuário:** HU-21  
**Prioridade:** Média

**Descrição:** O sistema deve permitir que administradores criem e gerenciem cupons de desconto.

**Requisitos Detalhados:**

1. O administrador deve poder criar novos cupons configurando:
   - Código do cupom (único)
   - Tipo de desconto (percentual ou valor fixo)
   - Valor do desconto
   - Data de validade (início e fim)
   - Limite de uso (por cliente ou total)
   - Produtos/categorias aplicáveis

2. O administrador deve poder:
   - Visualizar lista de cupons (ativos, expirados)
   - Editar cupons existentes
   - Desativar cupons
   - Visualizar estatísticas de uso

**Regras de Negócio:**
- RN-040: Cupons podem ser aplicados apenas uma vez por cliente (se configurado)
- RN-041: Prioridade de aplicação deve ser definida (maior desconto, primeiro inserido)

**Requisitos Não Funcionais:**
- RNF-038: Criação e gerenciamento devem ser ágeis
- RNF-039: Sistema deve garantir unicidade dos códigos

---

### RF-021: Geração de Relatórios

**História de Usuário:** HU-23  
**Prioridade:** Média

**Descrição:** O sistema deve permitir gerar relatórios de vendas.

**Requisitos Detalhados:**

1. O sistema deve permitir gerar relatórios:
   - De vendas por período
   - De vendas por produto
   - De vendas por cliente
   - De produtos mais vendidos
   - De produtos menos vendidos
   - De maiores compradores

2. Os relatórios devem ser exportáveis em:
   - CSV
   - Excel (XLSX)
   - PDF

3. Os relatórios devem permitir filtros:
   - Por período (diário, semanal, mensal, anual, customizado)
   - Por produto
   - Por categoria
   - Por cliente

**Regras de Negócio:**
- RN-042: Apenas administradores podem gerar relatórios
- RN-043: Dados dos relatórios devem ser consistentes com dados de vendas

**Requisitos Não Funcionais:**
- RNF-040: Geração de relatórios complexos deve ser otimizada
- RNF-041: Interface de seleção de filtros deve ser fácil de usar

---

### RF-022: Configuração de Frete

**História de Usuário:** HU-25  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir configurar opções e valores de frete.

**Requisitos Detalhados:**

1. O administrador deve poder:
   - Adicionar, editar e remover modalidades de frete
   - Configurar regras de preço (tabela por CEP, por peso, por faixa de valor)
   - Definir regiões de atendimento
   - Configurar regras de frete grátis

2. Para cada modalidade, deve ser possível configurar:
   - Nome da modalidade
   - Regras de cálculo
   - Regiões atendidas
   - Prazos de entrega

**Regras de Negócio:**
- RN-044: Configurações devem ser aplicadas em tempo real nos cálculos
- RN-045: Regras de frete devem ter prioridade caso haja conflito

**Requisitos Não Funcionais:**
- RNF-042: Interface de configuração deve ser clara e robusta
- RNF-043: Cálculo de frete deve ser otimizado

---

## 8. Módulo: Expedição

### RF-023: Notificações de Pedidos Aprovados

**História de Usuário:** HU-26  
**Prioridade:** Alta

**Descrição:** O sistema deve notificar funcionários da expedição sobre novos pedidos aprovados.

**Requisitos Detalhados:**

1. Quando um pedido é aprovado, o sistema deve:
   - Enviar notificação visual/sonora para funcionários da expedição
   - Incluir número do pedido
   - Incluir link direto para detalhes do pedido

2. O funcionário deve poder:
   - Visualizar notificações
   - Desativar/ativar notificações

**Regras de Negócio:**
- RN-046: Apenas pedidos com status "Aprovado" devem gerar notificação
- RN-047: Notificação deve ser disparada assim que pagamento for confirmado

**Requisitos Não Funcionais:**
- RNF-044: Sistema de notificação deve ser em tempo real
- RNF-045: Notificação deve ser persistente até visualização

---

### RF-024: Lista de Pedidos para Separação

**História de Usuário:** HU-27  
**Prioridade:** Alta

**Descrição:** O sistema deve exibir lista de pedidos para separação.

**Requisitos Detalhados:**

1. O funcionário da expedição deve ter acesso a tela com lista de pedidos pendentes

2. A lista deve exibir:
   - Número do pedido
   - Data do pedido
   - Nome do cliente
   - Prazo de envio
   - Status

3. O sistema deve permitir:
   - Filtrar por status
   - Ordenar por prioridade, data, prazo de envio
   - Visualizar detalhes do pedido

4. Ao clicar em um pedido, o funcionário deve ver:
   - Lista de produtos a serem separados
   - Localização dos produtos no estoque (se aplicável)

**Regras de Negócio:**
- RN-048: Apenas pedidos "Aprovado" ou "Em Preparação" devem aparecer na lista
- RN-049: Pedidos mais antigos ou com prazo mais curto devem ter prioridade visual

**Requisitos Não Funcionais:**
- RNF-046: Lista deve carregar rapidamente mesmo com grande volume
- RNF-047: Interface deve ser projetada para uso em ambiente de expedição

---

### RF-025: Registro de Saída de Estoque

**História de Usuário:** HU-28  
**Prioridade:** Alta

**Descrição:** O sistema deve permitir registrar saída de produtos do estoque após separação.

**Requisitos Detalhados:**

1. Após separação de um pedido, o funcionário deve poder registrar baixa dos itens

2. A baixa pode ser feita:
   - Manualmente (selecionando produtos e quantidades)
   - Por leitura de código de barras

3. O sistema deve:
   - Confirmar a baixa
   - Atualizar estoque disponível em tempo real
   - Alertar se houver tentativa de baixar item não disponível

**Regras de Negócio:**
- RN-050: Apenas funcionários autorizados da expedição podem realizar baixa
- RN-051: Quantidade baixada deve corresponder à quantidade do pedido

**Requisitos Não Funcionais:**
- RNF-048: Processo de baixa deve ser rápido e eficiente
- RNF-049: Integração com leitores de código de barras deve ser fluida

---

### RF-026: Geração de Documentos de Envio

**História de Usuário:** HU-29  
**Prioridade:** Alta

**Descrição:** O sistema deve gerar etiquetas de envio e notas fiscais.

**Requisitos Detalhados:**

1. Para cada pedido na lista de expedição, o funcionário deve poder gerar:
   - Etiqueta de envio (com informações para transportadora)
   - Nota Fiscal (se aplicável)

2. A etiqueta de envio deve conter:
   - Endereço completo de entrega
   - Dados do cliente
   - Peso e dimensões
   - Código de rastreamento

3. O sistema deve permitir:
   - Impressão individual
   - Impressão em lote

4. A emissão de Nota Fiscal deve estar integrada a sistema fiscal ou gerar documento conforme legislação

**Regras de Negócio:**
- RN-052: Informações da etiqueta devem ser puxadas automaticamente dos dados do pedido
- RN-053: Emissão de notas fiscais deve estar em conformidade com legislação fiscal

**Requisitos Não Funcionais:**
- RNF-050: Geração de documentos deve ser rápida e formatada para impressão
- RNF-051: Integração com sistemas de transportadoras e fiscais deve ser robusta

---

## 9. Módulo: Produção (Torrefação)

### RF-027: Registro de Torra de Lotes

**História de Usuário:** HU-30  
**Prioridade:** Média

**Descrição:** O sistema deve permitir registrar torra de novos lotes de café.

**Requisitos Detalhados:**

1. O barista/responsável deve ter acesso a interface para registrar novos lotes

2. O registro deve incluir:
   - Data da torra
   - Tipo de grão
   - Peso antes da torra (kg)
   - Peso após a torra (kg)
   - Nível de torra
   - Observações

3. O sistema deve:
   - Gerar identificador único para cada lote
   - Permitir visualizar histórico de torras
   - Associar lotes a produtos (para rastreabilidade)

**Regras de Negócio:**
- RN-054: Apenas usuários com perfil "Barista" ou "Produção" podem registrar torras
- RN-055: Sistema pode sugerir níveis de torra com base no tipo de grão

**Requisitos Não Funcionais:**
- RNF-052: Interface de registro deve ser simples e rápida
- RNF-053: Dados devem permitir relatórios de rastreabilidade e qualidade

---

## 10. Módulo: Interface e Usabilidade

### RF-028: Experiência Responsiva

**História de Usuário:** HU-17  
**Prioridade:** Alta

**Descrição:** O sistema deve ser totalmente responsivo para diferentes dispositivos.

**Requisitos Detalhados:**

1. Todas as páginas devem se adaptar a:
   - Smartphones
   - Tablets
   - Desktops

2. Elementos interativos devem ser:
   - Tamanho adequado para toque em mobile
   - Fáceis de usar em telas pequenas

3. O checkout deve ser simplificado para dispositivos móveis

4. O menu de navegação deve ser acessível (menu hambúrguer em mobile)

**Requisitos Não Funcionais:**
- RNF-054: Tempo de carregamento em mobile deve ser otimizado
- RNF-055: Compatibilidade com principais navegadores móveis (Chrome, Safari, Firefox)

---

## 11. Matriz de Rastreabilidade

| RF | HU Relacionada | Prioridade | Módulo |
|----|----------------|------------|--------|
| RF-001 | HU-01 | Alta | Gestão de Contas |
| RF-002 | HU-01 | Alta | Gestão de Contas |
| RF-003 | HU-24 | Alta | Gestão de Contas |
| RF-004 | HU-02 | Alta | Catálogo |
| RF-005 | HU-05 | Alta | Catálogo |
| RF-006 | HU-15 | Média | Catálogo |
| RF-007 | HU-03 | Alta | Carrinho |
| RF-008 | HU-06 | Média | Carrinho |
| RF-009 | HU-07 | Alta | Checkout |
| RF-010 | HU-08 | Alta | Checkout |
| RF-011 | HU-04 | Alta | Pós-Venda |
| RF-012 | HU-09 | Alta | Pós-Venda |
| RF-013 | HU-10 | Média | Fidelidade |
| RF-014 | HU-11 | Média | Funcionalidades |
| RF-015 | HU-16 | Média | Funcionalidades |
| RF-016 | HU-12 | Baixa | Funcionalidades |
| RF-017 | HU-13 | Baixa | Funcionalidades |
| RF-018 | HU-18 | Alta | Backoffice |
| RF-019 | HU-20 | Alta | Backoffice |
| RF-020 | HU-21 | Média | Backoffice |
| RF-021 | HU-23 | Média | Backoffice |
| RF-022 | HU-25 | Alta | Backoffice |
| RF-023 | HU-26 | Alta | Expedição |
| RF-024 | HU-27 | Alta | Expedição |
| RF-025 | HU-28 | Alta | Expedição |
| RF-026 | HU-29 | Alta | Expedição |
| RF-027 | HU-30 | Média | Produção |
| RF-028 | HU-17 | Alta | Interface |

---

## 12. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Detalhar requisitos não funcionais
- Criar casos de teste para cada requisito
- Validar requisitos com stakeholders


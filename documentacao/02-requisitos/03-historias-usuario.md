# Histórias de Usuário
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha  
**RGM:** 44030509

---

## 1. Introdução

Este documento apresenta as 30 histórias de usuário (User Stories) do projeto Soto Café, organizadas por tema funcional. Cada história segue o formato padrão: "Como [tipo de usuário], eu quero [ação] para que [benefício]".

---

## 2. Histórias de Usuário - Cliente

### HU-01: Criar Conta de Usuário

**Título:** Criar Conta de Usuário  
**Requerente:** Cliente Novo  
**Prioridade:** Alta  
**Pontos de História:** 5

**Descrição:**
Como cliente novo, eu quero me cadastrar facilmente no site para que possa realizar compras e acompanhar meus pedidos.

**Comentários:**
A criação de conta deve validar dados como e-mail único, senha forte e coletar informações básicas para futuras compras (nome, telefone).

**Critérios de Aceitação:**
- CA#1: O sistema deve validar que o e-mail informado não está cadastrado
- CA#2: A senha deve ter no mínimo 8 caracteres, incluindo letras, números e pelo menos um caractere especial
- CA#3: O sistema deve enviar um e-mail de confirmação de cadastro com um link de ativação da conta
- CA#4: Após o cadastro e ativação, o usuário deve conseguir fazer login com as credenciais criadas

**Regras de Negócio:**
- RN#1: E-mail deve ser único por usuário
- RN#2: Senha deve ser criptografada antes do armazenamento no banco de dados
- RN#3: Campos obrigatórios para cadastro: Nome Completo, E-mail, Senha, Confirmação de Senha

**Requisitos Não Funcionais:**
- RNF#1: O processo de cadastro e envio de e-mail deve ser concluído em até 5 segundos
- RNF#2: Os dados do usuário devem ser transmitidos e armazenados utilizando protocolos e práticas de segurança (HTTPS, criptografia)

---

### HU-02: Navegar por Categorias de Produtos

**Título:** Navegar por Categorias de Produtos  
**Requerente:** Cliente Curioso  
**Prioridade:** Alta  
**Pontos de História:** 3

**Descrição:**
Como cliente, eu quero navegar por categorias de café (Ex: Grãos, Moído, Cápsulas, Kits) para que possa encontrar rapidamente o tipo de café que procuro.

**Comentários:**
As categorias devem ser claras e permitir filtros adicionais (origem, torra, preço) para refinar a busca.

**Critérios de Aceitação:**
- CA#1: O sistema deve exibir as categorias de produtos de forma clara na navegação do site (menu principal, sidebar)
- CA#2: Ao clicar em uma categoria, o sistema deve listar apenas os produtos pertencentes a ela
- CA#3: Deve ser possível aplicar filtros por subcategorias, origem, torra, ou tipo de moagem (se aplicável)
- CA#4: A navegação entre categorias e a aplicação de filtros deve ser intuitiva

**Regras de Negócio:**
- RN#1: A categorização dos produtos deve seguir a estrutura de classes definida pela gestão de estoque
- RN#2: Produtos sem estoque devem ser exibidos com uma etiqueta de "Indisponível" ou não aparecer (definir regra)

**Requisitos Não Funcionais:**
- RNF#1: A página de categoria deve carregar em até 2 segundos, mesmo com muitos produtos
- RNF#2: A navegação e os filtros devem funcionar corretamente em diferentes dispositivos (desktop, tablet, mobile)

---

### HU-03: Adicionar Produto ao Carrinho

**Título:** Adicionar Produto ao Carrinho  
**Requerente:** Cliente Conveniente  
**Prioridade:** Alta  
**Pontos de História:** 3

**Descrição:**
Como cliente, eu quero adicionar vários produtos ao carrinho de compras para que possa finalizar uma única transação para todos os itens desejados.

**Comentários:**
O processo de adição ao carrinho deve ser simples, com confirmação visual e fácil acesso ao carrinho.

**Critérios de Aceitação:**
- CA#1: O botão "Adicionar ao Carrinho" deve estar visível e funcional na página de detalhes do produto e, se possível, na listagem de produtos
- CA#2: Ao adicionar um produto, o sistema deve exibir uma confirmação visual (ex: um pop-up ou atualização de ícone do carrinho)
- CA#3: O carrinho de compras deve exibir a lista de produtos adicionados, suas quantidades e o subtotal
- CA#4: Deve ser possível ajustar a quantidade de um item ou removê-lo do carrinho

**Regras de Negócio:**
- RN#1: Não deve ser possível adicionar ao carrinho uma quantidade maior do que a disponível em estoque
- RN#2: O preço do produto no carrinho deve refletir o preço atual de venda

**Requisitos Não Funcionais:**
- RNF#1: A adição de um produto ao carrinho deve ser quase instantânea (menos de 1 segundo)
- RNF#2: O carrinho deve ser persistente mesmo que o usuário feche o navegador e retorne (ex: por 24h ou até a compra ser finalizada)

---

### HU-04: Acompanhar Status do Pedido

**Título:** Acompanhar Status do Pedido  
**Requerente:** Cliente Atento  
**Prioridade:** Alta  
**Pontos de História:** 8

**Descrição:**
Como cliente, eu quero acompanhar o status do meu pedido (confirmado, em preparação, enviado, entregue) para que possa saber onde meu café está a qualquer momento.

**Comentários:**
O cliente deve ter uma página dedicada para visualizar o histórico de seus pedidos e o status atual de cada um.

**Critérios de Aceitação:**
- CA#1: O cliente logado deve ter uma seção "Meus Pedidos" em seu perfil
- CA#2: Na lista de pedidos, cada item deve exibir o número do pedido, data, valor e status atual
- CA#3: Ao clicar em um pedido específico, o cliente deve ver um detalhamento do status (com data/hora da mudança de status) e, se aplicável, o código de rastreamento da transportadora
- CA#4: O sistema deve enviar notificações por e-mail a cada mudança de status importante (confirmação, envio, entrega)

**Regras de Negócio:**
- RN#1: A atualização dos status deve ser manual pela equipe da cafeteria ou automatizada via integração com transportadora
- RN#2: Apenas pedidos com status "Enviado" devem exibir código de rastreamento

**Requisitos Não Funcionais:**
- RNF#1: A página de "Meus Pedidos" deve carregar em até 3 segundos
- RNF#2: O sistema de notificações por e-mail deve ter alta disponibilidade e garantir a entrega das mensagens

---

### HU-06: Aplicar Cupons de Desconto

**Título:** Aplicar Cupons de Desconto  
**Requerente:** Cliente Otimizador  
**Prioridade:** Média  
**Pontos de História:** 5

**Descrição:**
Como cliente, eu quero aplicar cupons de desconto ou vouchers no carrinho para que possa aproveitar promoções e economizar.

**Comentários:**
O campo para inserir o cupom deve ser claro e o desconto deve ser aplicado imediatamente no subtotal.

**Critérios de Aceitação:**
- CA#1: O sistema deve exibir um campo no carrinho de compras ou no checkout para inserção de cupom/voucher
- CA#2: Ao inserir um código de cupom válido, o sistema deve aplicar o desconto correspondente e atualizar o valor total do pedido
- CA#3: Se o cupom for inválido ou já tiver sido usado, o sistema deve exibir uma mensagem de erro clara
- CA#4: Cupons com data de validade expirada ou limite de uso excedido não devem ser aplicados

**Regras de Negócio:**
- RN#1: Cada cupom tem uma validade (data de início e fim) e um limite de uso (por cliente ou total)
- RN#2: Cupons podem ser percentuais (ex: 10% OFF) ou de valor fixo (ex: R$20 OFF)
- RN#3: Cupons podem ser aplicáveis a categorias específicas de produtos ou ao valor total do pedido

**Requisitos Não Funcionais:**
- RNF#1: A validação e aplicação do cupom deve ocorrer em menos de 1 segundo
- RNF#2: A interface de aplicação de cupom deve ser intuitiva e responsiva em dispositivos móveis

---

### HU-07: Visualizar Opções de Frete

**Título:** Visualizar Opções de Frete  
**Requerente:** Cliente Preocupado com a Entrega  
**Prioridade:** Alta  
**Pontos de História:** 8

**Descrição:**
Como cliente, eu quero visualizar as opções de frete e prazos de entrega para o meu CEP para que possa escolher a modalidade que melhor se adapta à minha necessidade.

**Comentários:**
As opções de frete devem ser apresentadas de forma clara com o valor e o prazo estimado.

**Critérios de Aceitação:**
- CA#1: No carrinho de compras ou no checkout, deve haver um campo para inserir o CEP do cliente
- CA#2: Após a inserção do CEP, o sistema deve exibir as modalidades de frete disponíveis (ex: PAC, SEDEX, Motoboy) com seus respectivos valores e prazos estimados
- CA#3: O valor do frete selecionado deve ser somado ao total do pedido
- CA#4: Para CEPs não atendidos, o sistema deve exibir uma mensagem informando a impossibilidade de entrega

**Regras de Negócio:**
- RN#1: Os valores e prazos de frete devem ser calculados com base em tabelas de transportadoras e/ou regras de negócio da cafeteria (ex: frete grátis acima de X valor)
- RN#2: O cálculo do frete pode considerar peso, dimensões dos produtos e CEP de origem/destino

**Requisitos Não Funcionais:**
- RNF#1: O cálculo e exibição das opções de frete deve ocorrer em no máximo 2 segundos
- RNF#2: O sistema deve ser capaz de integrar com APIs de cálculo de frete de transportadoras

---

### HU-08: Realizar Pagamento Seguro

**Título:** Realizar Pagamento Seguro  
**Requerente:** Cliente Seguro  
**Prioridade:** Alta  
**Pontos de História:** 13

**Descrição:**
Como cliente, eu quero realizar o pagamento de forma segura (Cartão de Crédito, Pix, Boleto) para que possa ter certeza de que minhas informações financeiras estão protegidas.

**Comentários:**
O processo de pagamento deve ser transparente, seguro e oferecer múltiplas opções.

**Critérios de Aceitação:**
- CA#1: O sistema deve apresentar as opções de pagamento disponíveis (Cartão de Crédito, Pix, Boleto) no checkout
- CA#2: Para cartão de crédito, o sistema deve coletar dados como número, validade, CVV e nome do titular em ambiente seguro
- CA#3: Para Pix, o sistema deve gerar um QR Code e/ou um código Pix Copia e Cola
- CA#4: Para Boleto, o sistema deve gerar um boleto bancário para impressão ou download
- CA#5: Após a confirmação do pagamento, o sistema deve exibir uma mensagem de sucesso e redirecionar para a página de confirmação do pedido

**Regras de Negócio:**
- RN#1: A integração com o gateway de pagamento deve seguir os padrões de segurança PCI-DSS (para cartão de crédito)
- RN#2: Pagamentos via Pix e Cartão de Crédito devem ter validação em tempo real. Boleto tem prazo de compensação

**Requisitos Não Funcionais:**
- RNF#1: A página de pagamento deve ter um certificado SSL válido (HTTPS)
- RNF#2: O tempo de processamento do pagamento deve ser otimizado para a melhor experiência do usuário (ex: Pix e Cartão em < 3 segundos)
- RNF#3: A integração com o gateway de pagamento deve ser robusta e ter alta disponibilidade

---

### HU-09: Receber Confirmação do Pedido por E-mail

**Título:** Receber Confirmação do Pedido por E-mail  
**Requerente:** Cliente Ansioso  
**Prioridade:** Alta  
**Pontos de História:** 3

**Descrição:**
Como cliente, eu quero receber confirmação do pedido por e-mail após a compra para que possa ter certeza de que meu pedido foi processado.

**Comentários:**
O e-mail deve conter todos os detalhes do pedido e um link para acompanhamento.

**Critérios de Aceitação:**
- CA#1: Após a finalização bem-sucedida do pedido, o sistema deve enviar um e-mail de confirmação para o endereço de e-mail cadastrado do cliente
- CA#2: O e-mail de confirmação deve conter o número do pedido, lista de produtos, valor total, endereço de entrega e método de pagamento
- CA#3: O e-mail deve incluir um link para a página de "Meus Pedidos" ou para o acompanhamento específico do pedido

**Regras de Negócio:**
- RN#1: O e-mail deve ser enviado somente após a confirmação do pagamento (ou no caso de boleto, após a geração do boleto)
- RN#2: O template do e-mail deve ser padronizado e conter a logo da cafeteria

**Requisitos Não Funcionais:**
- RNF#1: O envio do e-mail de confirmação deve ocorrer em até 1 minuto após a aprovação do pagamento
- RNF#2: O serviço de envio de e-mails deve ter alta taxa de entrega (não cair em spam)

---

### HU-10: Acumular Pontos em Programa de Fidelidade

**Título:** Acumular Pontos em Programa de Fidelidade  
**Requerente:** Cliente Fidelizado  
**Prioridade:** Média  
**Pontos de História:** 8

**Descrição:**
Como cliente, eu quero acumular pontos ou ter acesso a um programa de fidelidade para que possa receber descontos ou benefícios exclusivos em futuras compras.

**Comentários:**
O programa de fidelidade deve ser transparente e de fácil acesso, com o saldo de pontos visível.

**Critérios de Aceitação:**
- CA#1: O sistema deve exibir o saldo de pontos do cliente em seu perfil
- CA#2: Após cada compra concluída, os pontos devem ser adicionados ao saldo do cliente com base nas regras do programa
- CA#3: O cliente deve ter a opção de resgatar pontos por descontos ou produtos específicos em compras futuras
- CA#4: O sistema deve notificar o cliente sobre o status de seus pontos e promoções exclusivas para fidelizados

**Regras de Negócio:**
- RN#1: A regra de conversão de valor gasto para pontos deve ser configurável (ex: R$1 gasto = 1 ponto)
- RN#2: A regra de resgate de pontos deve ser configurável (ex: 100 pontos = R$5 de desconto ou produto X)
- RN#3: Pontos podem ter validade

**Requisitos Não Funcionais:**
- RNF#1: A atualização do saldo de pontos deve ser em tempo real após a conclusão da compra
- RNF#2: O sistema deve ser escalável para suportar um grande volume de clientes e transações de pontos

---

### HU-11: Encontrar Kits de Presente Personalizáveis

**Título:** Encontrar Kits de Presente Personalizáveis  
**Requerente:** Cliente Presenteador  
**Prioridade:** Média  
**Pontos de História:** 8

**Descrição:**
Como cliente, eu quero encontrar kits de presente personalizáveis com diferentes cafés e acessórios para que possa surpreender amigos e familiares com um presente especial de café.

**Comentários:**
A funcionalidade deve permitir a seleção de itens para compor um kit, com visualização do preço final.

**Critérios de Aceitação:**
- CA#1: O site deve ter uma seção dedicada a "Kits de Presente" ou "Monte seu Kit"
- CA#2: O cliente deve conseguir selecionar uma base (ex: caixa, cesta) e adicionar produtos de diferentes categorias (cafés, xícaras, acessórios) ao kit
- CA#3: O preço do kit deve ser atualizado dinamicamente conforme os itens são adicionados
- CA#4: Deve haver uma opção para adicionar uma mensagem personalizada ao presente

**Regras de Negócio:**
- RN#1: A seleção de itens para kits pode ser limitada a produtos específicos ou categorias para evitar incompatibilidades
- RN#2: Pode haver um preço mínimo ou máximo para kits personalizados

**Requisitos Não Funcionais:**
- RNF#1: A interface de montagem do kit deve ser visualmente atraente e fácil de usar
- RNF#2: A experiência em dispositivos móveis para montar o kit deve ser fluida

---

### HU-12: Acessar Seção de Perguntas Frequentes (FAQ)

**Título:** Acessar Seção de Perguntas Frequentes (FAQ)  
**Requerente:** Cliente com Dúvidas  
**Prioridade:** Baixa  
**Pontos de História:** 2

**Descrição:**
Como cliente, eu quero acessar uma seção de Perguntas Frequentes (FAQ) para que possa encontrar respostas rápidas para minhas dúvidas mais comuns.

**Comentários:**
A FAQ deve ser organizada por tópicos e de fácil pesquisa.

**Critérios de Aceitação:**
- CA#1: O site deve ter um link claro para a seção de FAQ (ex: no rodapé ou menu de ajuda)
- CA#2: A FAQ deve ser organizada por categorias (ex: "Pedidos", "Envio", "Produtos", "Pagamento")
- CA#3: Deve ser possível pesquisar por termos específicos dentro da FAQ
- CA#4: As respostas devem ser claras e concisas

**Regras de Negócio:**
- RN#1: O conteúdo da FAQ deve ser gerenciável pelo administrador do e-commerce

**Requisitos Não Funcionais:**
- RNF#1: A página da FAQ deve carregar rapidamente
- RNF#2: A funcionalidade de busca da FAQ deve ser eficiente

---

### HU-13: Acessar Blog de Conteúdo sobre Café

**Título:** Acessar Blog de Conteúdo sobre Café  
**Requerente:** Cliente que Gosta de Aprender  
**Prioridade:** Baixa  
**Pontos de História:** 5

**Descrição:**
Como cliente, eu quero acessar um blog ou área de conteúdo com artigos sobre café (preparo, história, tipos, harmonização) para que possa aprimorar meus conhecimentos sobre o universo do café gourmet.

**Comentários:**
O blog deve ter artigos bem escritos e imagens de qualidade, com opções de compartilhamento.

**Critérios de Aceitação:**
- CA#1: O site deve ter um link visível para o blog ou área de conteúdo
- CA#2: O blog deve exibir uma lista de artigos com títulos e miniaturas
- CA#3: Cada artigo deve ser legível, com formatação adequada e imagens/vídeos
- CA#4: Deve haver opções de compartilhamento social para os artigos

**Regras de Negócio:**
- RN#1: O conteúdo do blog deve ser gerenciável por um CMS (Content Management System) interno ou externo
- RN#2: Artigos podem ser categorizados por tópicos ou tags

**Requisitos Não Funcionais:**
- RNF#1: As páginas do blog devem ser otimizadas para SEO (Search Engine Optimization)
- RNF#2: O carregamento das páginas do blog deve ser rápido

---

### HU-14: Contatar Suporte ao Cliente

**Título:** Contatar Suporte ao Cliente  
**Requerente:** Cliente com Problemas  
**Prioridade:** Média  
**Pontos de História:** 5

**Descrição:**
Como cliente, eu quero contatar o suporte ao cliente por chat ou e-mail para que possa resolver problemas com meu pedido ou produtos.

**Comentários:**
As opções de contato devem ser visíveis e o atendimento eficiente.

**Critérios de Aceitação:**
- CA#1: O site deve exibir claramente as opções de contato (ex: link para chat, formulário de e-mail, telefone)
- CA#2: O chat online deve estar disponível em horário comercial, com chatbot para atendimento fora de horário
- CA#3: O formulário de e-mail deve permitir ao cliente descrever o problema e anexar arquivos
- CA#4: O cliente deve receber uma confirmação de recebimento do contato

**Regras de Negócio:**
- RN#1: Todos os contatos devem ser registrados em um sistema de CRM/atendimento
- RN#2: O tempo de resposta para e-mails deve ser definido (ex: 24h úteis)

**Requisitos Não Funcionais:**
- RNF#1: O chat deve ter alta disponibilidade e baixa latência
- RNF#2: O sistema de e-mail deve ser confiável para envio e recebimento

---

### HU-15: Usar Barra de Pesquisa de Produtos

**Título:** Usar Barra de Pesquisa de Produtos  
**Requerente:** Cliente Buscador  
**Prioridade:** Média  
**Pontos de História:** 5

**Descrição:**
Como cliente, eu quero usar a barra de pesquisa para encontrar produtos específicos ou termos relacionados a café para que possa localizar rapidamente o que me interessa.

**Comentários:**
A pesquisa deve ser rápida e oferecer sugestões.

**Critérios de Aceitação:**
- CA#1: Uma barra de pesquisa deve estar visível e acessível em todas as páginas do e-commerce
- CA#2: Ao digitar na barra de pesquisa, o sistema deve apresentar sugestões de produtos ou termos (autocomplete)
- CA#3: Os resultados da pesquisa devem ser relevantes e exibir produtos que correspondam aos termos digitados
- CA#4: A página de resultados da pesquisa deve permitir filtros e ordenação (ex: por preço, relevância)

**Regras de Negócio:**
- RN#1: A pesquisa deve considerar nomes de produtos, descrições e categorias
- RN#2: Deve haver um algoritmo de relevância para ordenar os resultados

**Requisitos Não Funcionais:**
- RNF#1: A busca deve ser quase instantânea (menos de 1 segundo)
- RNF#2: O sistema de busca deve ser robusto e escalável para lidar com grande volume de dados e requisições

---

### HU-16: Inscrever-se em Clube de Assinatura

**Título:** Inscrever-se em Clube de Assinatura  
**Requerente:** Cliente Assinante (potencial)  
**Prioridade:** Média  
**Pontos de História:** 13

**Descrição:**
Como cliente, eu quero me inscrever em um clube de assinatura de café para que possa receber cafés selecionados regularmente em minha casa.

**Comentários:**
A página do clube de assinatura deve ser clara sobre os planos, benefícios e processo.

**Critérios de Aceitação:**
- CA#1: O site deve ter uma seção dedicada ao clube de assinatura, com diferentes planos (ex: mensal, trimestral)
- CA#2: O cliente deve conseguir selecionar um plano, a frequência de entrega e realizar o pagamento recorrente
- CA#3: O sistema deve enviar confirmação da assinatura e detalhes das próximas entregas
- CA#4: O cliente deve poder gerenciar sua assinatura (pausar, cancelar, mudar plano) em seu perfil

**Regras de Negócio:**
- RN#1: Os planos de assinatura devem ser configuráveis (preço, frequência, tipo de café)
- RN#2: O sistema deve gerenciar pagamentos recorrentes e notificar sobre falhas no pagamento

**Requisitos Não Funcionais:**
- RNF#1: O processo de assinatura deve ser intuitivo e rápido
- RNF#2: A plataforma deve suportar cobrança recorrente de forma segura

---

### HU-17: Experiência Otimizada para Celular

**Título:** Experiência Otimizada para Celular  
**Requerente:** Cliente de Celular  
**Prioridade:** Alta  
**Pontos de História:** 8

**Descrição:**
Como cliente, eu quero ter uma experiência de navegação e compra otimizada para dispositivos móveis para que possa comprar café de forma conveniente em qualquer lugar.

**Comentários:**
O design deve ser responsivo e os elementos interativos fáceis de usar em telas pequenas.

**Critérios de Aceitação:**
- CA#1: Todas as páginas do e-commerce devem ser responsivas, adaptando-se a diferentes tamanhos de tela (smartphones, tablets)
- CA#2: Botões e elementos de toque devem ser grandes o suficiente para fácil interação
- CA#3: O checkout deve ser simplificado para dispositivos móveis
- CA#4: O menu de navegação deve ser acessível e funcional em dispositivos móveis (ex: menu hambúrguer)

**Regras de Negócio:**
- RN#1: Nenhuma regra de negócio diretamente associada; este é um requisito puramente técnico/de UX

**Requisitos Não Funcionais:**
- RNF#1: O tempo de carregamento das páginas em dispositivos móveis deve ser otimizado
- RNF#2: Compatibilidade com os principais navegadores móveis (Chrome, Safari, Firefox)

---

## 3. Histórias de Usuário - Administrador

### HU-05: Gerenciar Catálogo de Produtos

**Título:** Gerenciar Catálogo de Produtos  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Alta  
**Pontos de História:** 13

**Descrição:**
Como administrador, eu quero gerenciar o catálogo de produtos (adicionar, editar, remover cafés e acessórios) para que possa manter a loja sempre atualizada.

**Comentários:**
A interface de gerenciamento deve ser intuitiva e permitir a fácil adição de informações de produto, imagens e variações.

**Critérios de Aceitação:**
- CA#1: O administrador deve acessar um painel de gerenciamento de produtos com opções para "Adicionar Novo", "Editar" e "Remover"
- CA#2: Ao adicionar/editar um produto, devem estar disponíveis campos para Nome, Descrição, Preço, Categoria, Imagens, Estoque, Variações (ex: tipo de moagem, peso)
- CA#3: O sistema deve validar os campos obrigatórios e o formato dos dados (ex: preço numérico)
- CA#4: A remoção de um produto deve exigir confirmação para evitar exclusões acidentais
- CA#5: As alterações devem ser refletidas em tempo real no site do cliente

**Regras de Negócio:**
- RN#1: Apenas usuários com perfil de "Administrador" ou "Gerente de Conteúdo" podem acessar e modificar o catálogo
- RN#2: Produtos removidos não devem ser mais visíveis no site, mas seus dados históricos podem ser mantidos para relatórios

**Requisitos Não Funcionais:**
- RNF#1: A interface de gerenciamento de produtos deve ser responsiva e fácil de usar
- RNF#2: O upload de imagens deve ser otimizado para não prejudicar o desempenho do site

---

### HU-18: Visualizar Painel de Controle de Vendas

**Título:** Visualizar Painel de Controle de Vendas  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Alta  
**Pontos de História:** 8

**Descrição:**
Como administrador, eu quero visualizar um painel de controle com as principais métricas de vendas (pedidos, faturamento) para que possa acompanhar o desempenho geral do negócio.

**Comentários:**
O painel deve ser intuitivo, com gráficos e dados resumidos para tomada de decisão.

**Critérios de Aceitação:**
- CA#1: O administrador deve ter acesso a um painel de controle após o login
- CA#2: O painel deve exibir métricas chave como número de pedidos, faturamento total, ticket médio e produtos mais vendidos
- CA#3: Os dados devem ser visualizados por períodos (dia, semana, mês, ano)
- CA#4: O painel deve conter gráficos para fácil compreensão visual das tendências

**Regras de Negócio:**
- RN#1: Apenas usuários com perfil de "Administrador" podem acessar o painel
- RN#2: O cálculo das métricas deve ser preciso e refletir os dados transacionais

**Requisitos Não Funcionais:**
- RNF#1: O painel deve carregar em até 3 segundos
- RNF#2: Os gráficos devem ser interativos e fáceis de entender

---

### HU-19: Atualizar Preços e Estoque de Produtos

**Título:** Atualizar Preços e Estoque de Produtos  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Alta  
**Pontos de História:** 8

**Descrição:**
Como administrador, eu quero atualizar os preços e o estoque de produtos para que possa garantir a precisão das informações no site.

**Comentários:**
A atualização deve ser rápida e permitir edições em massa se necessário.

**Critérios de Aceitação:**
- CA#1: O administrador deve conseguir editar o preço de venda e o estoque de cada produto individualmente no painel de gerenciamento
- CA#2: O sistema deve validar a entrada de dados (ex: estoque não pode ser negativo)
- CA#3: As alterações devem ser refletidas em tempo real no site para os clientes
- CA#4: Deve haver uma funcionalidade para importação/exportação de planilhas para atualização em massa de preços e estoque

**Regras de Negócio:**
- RN#1: Apenas administradores podem alterar preços e estoque
- RN#2: A alteração de estoque deve impactar a disponibilidade do produto para compra

**Requisitos Não Funcionais:**
- RNF#1: A atualização individual deve ser quase instantânea
- RNF#2: A funcionalidade de atualização em massa deve processar um volume significativo de dados de forma eficiente

---

### HU-20: Gerenciar Pedidos

**Título:** Gerenciar Pedidos  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Alta  
**Pontos de História:** 13

**Descrição:**
Como administrador, eu quero gerenciar pedidos (mudar status, visualizar detalhes, emitir notas) para que possa garantir o fluxo eficiente das entregas.

**Comentários:**
A interface deve permitir uma visão clara dos pedidos e ações rápidas.

**Critérios de Aceitação:**
- CA#1: O administrador deve ter uma lista de todos os pedidos, com filtros por status (pendente, aprovado, em preparação, enviado, entregue, cancelado)
- CA#2: Ao clicar em um pedido, o administrador deve ver todos os detalhes (itens, cliente, endereço, pagamento, histórico de status)
- CA#3: O sistema deve permitir a alteração manual do status do pedido pelo administrador
- CA#4: Deve ser possível emitir notas fiscais ou comprovantes de venda para cada pedido
- CA#5: Deve ser possível cancelar um pedido e, se aplicável, iniciar o processo de estorno

**Regras de Negócio:**
- RN#1: Apenas administradores ou funcionários de expedição podem alterar status de pedidos
- RN#2: A emissão de notas fiscais deve seguir a legislação vigente

**Requisitos Não Funcionais:**
- RNF#1: A listagem e o detalhamento dos pedidos devem ser rápidos
- RNF#2: A interface de gerenciamento de pedidos deve ser intuitiva

---

### HU-21: Criar e Gerenciar Cupons de Desconto

**Título:** Criar e Gerenciar Cupons de Desconto  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Média  
**Pontos de História:** 8

**Descrição:**
Como administrador, eu quero criar e gerenciar códigos de cupom de desconto para que possa lançar promoções e campanhas de marketing.

**Comentários:**
A criação de cupons deve ser flexível, com muitas opções de configuração.

**Critérios de Aceitação:**
- CA#1: O administrador deve acessar uma seção para criar novos cupons de desconto
- CA#2: Ao criar um cupom, devem ser configuráveis: código, tipo (percentual/fixo), valor, data de validade, limite de uso (por cliente/total), produtos/categorias aplicáveis
- CA#3: O administrador deve visualizar uma lista de cupons existentes, com status (ativos, expirados)
- CA#4: Deve ser possível editar ou desativar cupons existentes

**Regras de Negócio:**
- RN#1: Cupons podem ser aplicados apenas uma vez por cliente (se configurado)
- RN#2: Prioridade de aplicação de cupons deve ser definida (ex: maior desconto, primeiro cupom inserido)

**Requisitos Não Funcionais:**
- RNF#1: A criação e gerenciamento de cupons deve ser um processo ágil
- RNF#2: O sistema deve garantir a unicidade dos códigos de cupom

---

### HU-22: Visualizar Histórico de Compras do Cliente

**Título:** Visualizar Histórico de Compras do Cliente  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Média  
**Pontos de História:** 5

**Descrição:**
Como administrador, eu quero visualizar o histórico de compras de um cliente específico para que possa oferecer um atendimento mais personalizado e identificar padrões de consumo.

**Comentários:**
O histórico deve ser completo e fácil de acessar pelo perfil do cliente.

**Critérios de Aceitação:**
- CA#1: Na tela de gerenciamento de clientes, deve ser possível clicar em um cliente para ver seu perfil detalhado
- CA#2: O perfil do cliente deve exibir uma lista de todos os pedidos realizados, com data, valor e produtos
- CA#3: Deve ser possível acessar os detalhes completos de cada pedido a partir do histórico do cliente

**Regras de Negócio:**
- RN#1: Apenas administradores ou atendentes de suporte podem acessar o histórico de compras de clientes
- RN#2: Dados sensíveis do cliente (ex: dados de pagamento) devem ser mascarados ou não exibidos

**Requisitos Não Funcionais:**
- RNF#1: A consulta do histórico de compras deve ser rápida
- RNF#2: A interface deve ser clara e organizada

---

### HU-23: Gerar Relatórios de Vendas

**Título:** Gerar Relatórios de Vendas  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Média  
**Pontos de História:** 13

**Descrição:**
Como administrador, eu quero gerar relatórios de vendas por período, produto ou cliente para que possa analisar o desempenho e identificar oportunidades de crescimento.

**Comentários:**
Os relatórios devem ser exportáveis e oferecer diferentes filtros.

**Critérios de Aceitação:**
- CA#1: O administrador deve acessar uma seção de "Relatórios" no painel
- CA#2: Deve ser possível gerar relatórios de vendas filtrados por período (diário, semanal, mensal, anual, customizado)
- CA#3: Deve ser possível gerar relatórios de vendas por produto (mais vendidos, menos vendidos)
- CA#4: Deve ser possível gerar relatórios de vendas por cliente (maiores compradores)
- CA#5: Os relatórios devem ser exportáveis em formatos comuns (ex: CSV, Excel, PDF)

**Regras de Negócio:**
- RN#1: Apenas administradores podem gerar relatórios
- RN#2: Os dados dos relatórios devem ser consistentes com os dados de vendas

**Requisitos Não Funcionais:**
- RNF#1: A geração de relatórios complexos deve ser otimizada para não travar o sistema
- RNF#2: A interface de seleção de filtros deve ser fácil de usar

---

### HU-24: Gerenciar Usuários e Permissões

**Título:** Gerenciar Usuários e Permissões  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Alta  
**Pontos de História:** 8

**Descrição:**
Como administrador, eu quero gerenciar usuários e suas permissões (clientes, funcionários) para que possa controlar o acesso ao sistema e suas funcionalidades.

**Comentários:**
O sistema deve permitir a criação de diferentes perfis de acesso.

**Critérios de Aceitação:**
- CA#1: O administrador deve ter acesso a uma seção para gerenciar usuários internos (funcionários)
- CA#2: Deve ser possível criar, editar e desativar contas de usuários internos
- CA#3: Ao criar/editar um usuário interno, deve ser possível atribuir diferentes perfis de permissão (ex: Administrador, Gerente de Conteúdo, Expedição, Suporte)
- CA#4: Apenas o administrador mestre pode gerenciar outros administradores

**Regras de Negócio:**
- RN#1: Cada perfil de usuário deve ter acesso restrito a funcionalidades específicas do painel administrativo
- RN#2: Auditoria de ações realizadas por usuários internos

**Requisitos Não Funcionais:**
- RNF#1: A interface de gerenciamento de usuários deve ser segura e fácil de usar
- RNF#2: A alteração de permissões deve ser aplicada imediatamente

---

### HU-25: Configurar Opções e Valores de Frete

**Título:** Configurar Opções e Valores de Frete  
**Requerente:** Administrador do E-commerce  
**Prioridade:** Alta  
**Pontos de História:** 13

**Descrição:**
Como administrador, eu quero configurar as opções e valores de frete para que possa oferecer diferentes modalidades de entrega aos clientes.

**Comentários:**
A configuração do frete deve ser flexível para abranger diferentes regras de negócio (por peso, CEP, valor do pedido).

**Critérios de Aceitação:**
- CA#1: O administrador deve acessar uma seção de "Configurações de Frete"
- CA#2: Deve ser possível adicionar, editar e remover modalidades de frete (ex: SEDEX, PAC, Retirada na Loja, Motoboy Local)
- CA#3: Para cada modalidade, deve ser possível configurar regras de preço (tabela por CEP, por peso, por faixa de valor do pedido)
- CA#4: Deve ser possível definir regiões de atendimento para cada modalidade de frete
- CA#5: Deve ser possível configurar regras de frete grátis (ex: a partir de X valor, para CEPs específicos)

**Regras de Negócio:**
- RN#1: As configurações de frete devem ser aplicadas em tempo real nos cálculos para o cliente
- RN#2: Regras de frete devem ter prioridade caso haja conflito (ex: frete grátis sobrescreve frete pago)

**Requisitos Não Funcionais:**
- RNF#1: A interface de configuração de frete deve ser clara e robusta
- RNF#2: O cálculo do frete deve ser otimizado para o tempo de resposta do checkout

---

## 4. Histórias de Usuário - Expedição

### HU-26: Receber Notificações de Novos Pedidos Aprovados

**Título:** Receber Notificações de Novos Pedidos Aprovados  
**Requerente:** Funcionário da Expedição  
**Prioridade:** Alta  
**Pontos de História:** 3

**Descrição:**
Como funcionário da expedição, eu quero receber notificações de novos pedidos aprovados para que possa iniciar o processo de separação e embalagem sem atrasos.

**Comentários:**
As notificações devem ser claras e indicar o número do pedido e itens.

**Critérios de Aceitação:**
- CA#1: O funcionário da expedição deve receber uma notificação visual ou sonora no sistema quando um novo pedido é aprovado
- CA#2: A notificação deve incluir o número do pedido e um link direto para os detalhes do pedido
- CA#3: Deve ser possível desativar/ativar as notificações

**Regras de Negócio:**
- RN#1: Apenas pedidos com status "Aprovado" devem gerar notificação para a expedição
- RN#2: A notificação deve ser disparada assim que o pagamento for confirmado

**Requisitos Não Funcionais:**
- RNF#1: O sistema de notificação deve ser em tempo real
- RNF#2: A notificação deve ser persistente até que o pedido seja visualizado ou processado

---

### HU-27: Acessar Lista de Pedidos para Separação

**Título:** Acessar Lista de Pedidos para Separação  
**Requerente:** Funcionário da Expedição  
**Prioridade:** Alta  
**Pontos de História:** 5

**Descrição:**
Como funcionário da expedição, eu quero acessar a lista de pedidos a serem separados para que possa organizar o trabalho de forma eficiente.

**Comentários:**
A lista deve ser clara, mostrar prioridades e permitir filtros.

**Critérios de Aceitação:**
- CA#1: O funcionário deve acessar uma tela específica com a lista de pedidos pendentes de separação
- CA#2: A lista deve exibir informações essenciais como número do pedido, data, nome do cliente e prazo de envio
- CA#3: Deve ser possível filtrar e ordenar a lista (ex: por prioridade, data de envio, mais antigos)
- CA#4: Ao clicar em um pedido, o funcionário deve ver os detalhes dos produtos a serem separados e suas localizações no estoque

**Regras de Negócio:**
- RN#1: Apenas pedidos com status "Aprovado" ou "Em Preparação" (se houver essa fase) devem aparecer nesta lista
- RN#2: Pedidos mais antigos ou com prazo de envio mais curto devem ter prioridade visual

**Requisitos Não Funcionais:**
- RNF#1: A lista de pedidos deve carregar rapidamente, mesmo com um grande volume
- RNF#2: A interface deve ser projetada para uso em ambiente de expedição (possivelmente com scanners)

---

### HU-28: Registrar Saída de Produtos do Estoque

**Título:** Registrar Saída de Produtos do Estoque  
**Requerente:** Funcionário da Expedição  
**Prioridade:** Alta  
**Pontos de História:** 5

**Descrição:**
Como funcionário da expedição, eu quero registrar a saída de produtos do estoque após a separação para que possa manter o inventário sempre atualizado no sistema.

**Comentários:**
O processo de baixa de estoque deve ser ágil e preciso.

**Critérios de Aceitação:**
- CA#1: Após a separação de um pedido, o funcionário deve conseguir registrar a baixa dos itens no estoque pelo sistema
- CA#2: A baixa pode ser feita manualmente ou por leitura de código de barras
- CA#3: O sistema deve confirmar a baixa e atualizar o estoque disponível do produto em tempo real
- CA#4: Se houver tentativa de baixar item não disponível, o sistema deve alertar

**Regras de Negócio:**
- RN#1: A baixa de estoque só pode ser realizada por funcionários autorizados da expedição
- RN#2: A quantidade baixada deve corresponder à quantidade do pedido

**Requisitos Não Funcionais:**
- RNF#1: O processo de baixa de estoque deve ser rápido e eficiente
- RNF#2: A integração com leitores de código de barras deve ser fluida

---

### HU-29: Gerar Etiquetas de Envio e Notas Fiscais

**Título:** Gerar Etiquetas de Envio e Notas Fiscais  
**Requerente:** Funcionário da Expedição  
**Prioridade:** Alta  
**Pontos de História:** 8

**Descrição:**
Como funcionário da expedição, eu quero gerar etiquetas de envio e notas fiscais para os pedidos para que possa agilizar o processo de despacho.

**Comentários:**
A geração deve ser automatizada e as informações precisas.

**Critérios de Aceitação:**
- CA#1: Para cada pedido na lista de expedição, deve haver uma opção para gerar a etiqueta de envio
- CA#2: A etiqueta de envio deve conter todas as informações necessárias para a transportadora (endereço, dados do cliente, peso, etc.)
- CA#3: Deve ser possível gerar a Nota Fiscal (se aplicável) diretamente do sistema, ou integrada a um sistema de emissão de NF
- CA#4: O sistema deve permitir a impressão em lote de etiquetas e notas fiscais

**Regras de Negócio:**
- RN#1: As informações da etiqueta devem ser puxadas automaticamente dos dados do pedido e do cliente
- RN#2: A emissão de notas fiscais deve estar em conformidade com a legislação fiscal

**Requisitos Não Funcionais:**
- RNF#1: A geração dos documentos deve ser rápida e formatada para impressão
- RNF#2: A integração com sistemas de transportadoras (para cotação/rastreamento) e sistemas fiscais (para NF) deve ser robusta

---

## 5. Histórias de Usuário - Produção

### HU-30: Registrar Torra de Novos Lotes de Café

**Título:** Registrar Torra de Novos Lotes de Café  
**Requerente:** Barista / Responsável pela Torrefação  
**Prioridade:** Média  
**Pontos de História:** 5

**Descrição:**
Como barista, eu quero registrar a torra de novos lotes de café para que possa monitorar a produção e a qualidade dos grãos.

**Comentários:**
Funcionalidade crucial se a torrefação for interna. Permite rastreabilidade.

**Critérios de Aceitação:**
- CA#1: O barista deve ter acesso a uma tela para registrar novos lotes de café torrado
- CA#2: O registro deve incluir informações como data da torra, tipo de grão, peso antes e depois da torra, nível de torra e observações
- CA#3: O sistema deve gerar um identificador único para cada lote torrado
- CA#4: Deve ser possível visualizar o histórico de torras

**Regras de Negócio:**
- RN#1: Apenas usuários com perfil "Barista" ou "Produção" podem registrar torras
- RN#2: O sistema pode sugerir níveis de torra com base no tipo de grão

**Requisitos Não Funcionais:**
- RNF#1: A interface de registro deve ser simples e rápida
- RNF#2: Os dados de torra devem ser armazenados de forma a permitir relatórios de rastreabilidade e qualidade

---

## 6. Resumo por Prioridade

### Alta Prioridade (18 histórias)
- HU-01, HU-02, HU-03, HU-04, HU-05, HU-07, HU-08, HU-09, HU-17, HU-18, HU-19, HU-20, HU-24, HU-25, HU-26, HU-27, HU-28, HU-29

### Média Prioridade (10 histórias)
- HU-06, HU-10, HU-11, HU-14, HU-15, HU-16, HU-21, HU-22, HU-23, HU-30

### Baixa Prioridade (2 histórias)
- HU-12, HU-13

---

## 7. Matriz de Rastreabilidade

| HU | Título | Requerente | Prioridade | Pontos | RF Relacionado |
|----|--------|------------|------------|--------|----------------|
| HU-01 | Criar Conta | Cliente | Alta | 5 | RF-001, RF-002 |
| HU-02 | Navegar Categorias | Cliente | Alta | 3 | RF-004 |
| HU-03 | Adicionar ao Carrinho | Cliente | Alta | 3 | RF-007 |
| HU-04 | Acompanhar Pedido | Cliente | Alta | 8 | RF-011 |
| HU-05 | Gerenciar Catálogo | Admin | Alta | 13 | RF-005 |
| HU-06 | Aplicar Cupom | Cliente | Média | 5 | RF-008 |
| HU-07 | Visualizar Frete | Cliente | Alta | 8 | RF-009 |
| HU-08 | Realizar Pagamento | Cliente | Alta | 13 | RF-010 |
| HU-09 | Confirmação E-mail | Cliente | Alta | 3 | RF-012 |
| HU-10 | Programa Fidelidade | Cliente | Média | 8 | RF-013 |
| HU-11 | Kits Personalizados | Cliente | Média | 8 | RF-014 |
| HU-12 | FAQ | Cliente | Baixa | 2 | RF-016 |
| HU-13 | Blog | Cliente | Baixa | 5 | RF-017 |
| HU-14 | Contatar Suporte | Cliente | Média | 5 | - |
| HU-15 | Buscar Produtos | Cliente | Média | 5 | RF-006 |
| HU-16 | Clube Assinatura | Cliente | Média | 13 | RF-015 |
| HU-17 | Mobile Responsivo | Cliente | Alta | 8 | RF-028 |
| HU-18 | Painel Vendas | Admin | Alta | 8 | RF-018 |
| HU-19 | Atualizar Preço/Estoque | Admin | Alta | 8 | RF-005 |
| HU-20 | Gerenciar Pedidos | Admin | Alta | 13 | RF-019 |
| HU-21 | Gerenciar Cupons | Admin | Média | 8 | RF-020 |
| HU-22 | Histórico Cliente | Admin | Média | 5 | - |
| HU-23 | Relatórios | Admin | Média | 13 | RF-021 |
| HU-24 | Gerenciar Usuários | Admin | Alta | 8 | RF-003 |
| HU-25 | Configurar Frete | Admin | Alta | 13 | RF-022 |
| HU-26 | Notificações Expedição | Expedição | Alta | 3 | RF-023 |
| HU-27 | Lista Separação | Expedição | Alta | 5 | RF-024 |
| HU-28 | Baixa Estoque | Expedição | Alta | 5 | RF-025 |
| HU-29 | Gerar Documentos | Expedição | Alta | 8 | RF-026 |
| HU-30 | Registrar Torra | Produção | Média | 5 | RF-027 |

---

## 8. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Validar histórias com stakeholders
- Priorizar para sprints
- Detalhar critérios de aceitação
- Criar casos de teste


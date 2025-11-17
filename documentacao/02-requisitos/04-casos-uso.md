# Casos de Uso
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha  
**RGM:** 44030509

---

## 1. Introdução

Este documento apresenta os casos de uso do sistema Soto Café, organizados por tema funcional. Cada caso de uso descreve uma interação entre atores e o sistema para alcançar um objetivo específico.

---

## 2. Casos de Uso - Gestão de Contas e Acesso

### CU-01: Gerenciar Contas de Usuários e Acessos

**Identificador:** CU-GA-01  
**Nome:** Gerenciar Contas de Usuários e Acessos  
**Atores:** Cliente, Administrador  
**Histórias de Usuário Relacionadas:** HU-01, HU-24

**Descrição:**
Permite que usuários se cadastrem no sistema e que administradores gerenciem contas de clientes e funcionários, atribuindo permissões de acesso.

**Pré-condições:**
- N/A (para cadastro)
- Usuário com permissão de administrador logado (para gerenciamento)

**Pós-condições:**
- Nova conta de usuário criada/ativada
- Permissões de usuário atualizadas

**Fluxo Principal:**
1. Um usuário (novo cliente ou administrador) inicia o processo de criação/gestão de conta
2. O sistema apresenta o formulário de cadastro ou a interface de gerenciamento de usuários
3. O usuário insere os dados necessários (informações pessoais, credenciais, permissões)
4. O sistema valida os dados de entrada
5. O sistema cria a conta ou atualiza os detalhes/permissões do usuário
6. Para novos clientes, o sistema envia e-mail de confirmação
7. O sistema exibe uma mensagem de sucesso

**Fluxos Alternativos:**

**3a. E-mail já cadastrado:**
- 3a.1. O sistema exibe mensagem de erro
- 3a.2. O usuário corrige o e-mail ou faz login

**4a. Dados inválidos:**
- 4a.1. O sistema exibe mensagens de erro específicas
- 4a.2. O usuário corrige os dados
- 4a.3. Retorna ao passo 4

**6a. Falha no envio de e-mail:**
- 6a.1. O sistema registra a falha
- 6a.2. O sistema permite reenvio do e-mail de confirmação

**Exceções:**
- E-1: Sistema indisponível - exibir mensagem de erro e sugerir tentar novamente
- E-2: Erro de conexão com banco de dados - registrar erro e notificar administrador

---

## 3. Casos de Uso - Navegação e Catálogo

### CU-02: Interagir com o Catálogo de Produtos

**Identificador:** CU-NAVEGA-01  
**Nome:** Interagir com o Catálogo de Produtos  
**Atores:** Cliente, Administrador  
**Histórias de Usuário Relacionadas:** HU-02, HU-05, HU-15

**Descrição:**
Permite que clientes naveguem, pesquisem e visualizem produtos, enquanto administradores gerenciam a disponibilidade e os detalhes do catálogo.

**Pré-condições:**
- Clientes acessam o site
- Administradores estão logados no painel de gestão

**Pós-condições:**
- Produtos exibidos/filtrados conforme solicitação
- Catálogo atualizado no sistema

**Fluxo Principal (Cliente):**
1. Um cliente deseja interagir com o catálogo de produtos
2. O cliente acessa categorias, utiliza a barra de pesquisa ou visualiza produtos
3. O sistema exibe os produtos conforme a ação do cliente
4. O cliente pode aplicar filtros e ordenação
5. O sistema atualiza a exibição dos produtos

**Fluxo Principal (Administrador):**
1. Um administrador deseja gerenciar o catálogo
2. O administrador acessa a interface de gerenciamento de produtos
3. O administrador adiciona, edita ou remove produtos, incluindo seus detalhes, preços e estoque
4. O sistema valida e aplica as alterações no catálogo
5. O sistema confirma a operação

**Fluxos Alternativos:**

**2a. Busca sem resultados:**
- 2a.1. O sistema exibe mensagem "Nenhum produto encontrado"
- 2a.2. O sistema sugere termos similares ou categorias

**3a. Produto sem estoque:**
- 3a.1. O sistema exibe etiqueta "Indisponível" ou oculta o produto (conforme configuração)

**4a. Validação falha (Admin):**
- 4a.1. O sistema exibe mensagens de erro
- 4a.2. O administrador corrige os dados
- 4a.3. Retorna ao passo 4

**Exceções:**
- E-1: Erro ao carregar produtos - exibir mensagem de erro e opção de recarregar
- E-2: Erro ao salvar alterações (Admin) - reverter alterações e notificar

---

## 4. Casos de Uso - Carrinho e Checkout

### CU-03: Gerenciar Carrinho e Finalizar Compra

**Identificador:** CU-CHECKOUT-01  
**Nome:** Gerenciar Carrinho e Finalizar Compra  
**Atores:** Cliente  
**Histórias de Usuário Relacionadas:** HU-03, HU-06, HU-07, HU-08

**Descrição:**
Permite que clientes adicionem produtos ao carrinho, gerenciem seus itens, apliquem descontos, selecionem opções de frete e efetuem o pagamento de forma segura.

**Pré-condições:**
- Produtos disponíveis para adição ao carrinho

**Pós-condições:**
- Pedido criado
- Estoque atualizado
- Pagamento processado

**Fluxo Principal:**
1. O cliente adiciona um produto ao carrinho
2. O cliente acessa a página do carrinho para revisar os itens
3. O cliente (opcionalmente) aplica um cupom de desconto
4. O cliente informa o CEP para cálculo de frete
5. O sistema exibe opções de frete com valores e prazos
6. O cliente seleciona a opção de frete e prossegue para o checkout
7. O cliente escolhe o método de pagamento e insere as informações necessárias
8. O sistema processa o pagamento com segurança
9. O sistema confirma a transação e finaliza a compra
10. O sistema envia e-mail de confirmação

**Fluxos Alternativos:**

**1a. Produto sem estoque:**
- 1a.1. O sistema exibe mensagem de erro
- 1a.2. O cliente remove o item ou ajusta a quantidade

**3a. Cupom inválido:**
- 3a.1. O sistema exibe mensagem de erro específica
- 3a.2. O cliente corrige o código ou remove o cupom

**4a. CEP não atendido:**
- 4a.1. O sistema exibe mensagem informativa
- 4a.2. O cliente pode alterar o endereço ou cancelar

**8a. Pagamento recusado:**
- 8a.1. O sistema exibe mensagem de erro
- 8a.2. O cliente pode tentar novamente ou escolher outro método

**Exceções:**
- E-1: Estoque insuficiente durante checkout - notificar cliente e atualizar carrinho
- E-2: Falha no gateway de pagamento - permitir nova tentativa
- E-3: Erro ao criar pedido - reverter pagamento se necessário

---

## 5. Casos de Uso - Pós-Venda e Fidelidade

### CU-04: Gerenciar Pós-Venda e Benefícios do Cliente

**Identificador:** CU-POSVENDA-01  
**Nome:** Gerenciar Pós-Venda e Benefícios do Cliente  
**Atores:** Cliente, Administrador  
**Histórias de Usuário Relacionadas:** HU-04, HU-09, HU-10, HU-22

**Descrição:**
Permite que clientes acompanhem seus pedidos, recebam comunicações pós-compra e participem de programas de fidelidade, enquanto administradores podem consultar o histórico de compras dos clientes.

**Pré-condições:**
- Pedido realizado e pago

**Pós-condições:**
- Cliente informado sobre o pedido
- Pontos acumulados/resgatados
- Histórico de compras consultado

**Fluxo Principal:**
1. O cliente realiza uma compra
2. O sistema envia uma confirmação do pedido por e-mail
3. O cliente pode acessar a página de "Meus Pedidos" para acompanhar o status
4. O sistema atualiza os pontos de fidelidade do cliente (se aplicável)
5. O cliente pode resgatar pontos ou visualizar seu saldo
6. (Para Administrador) O administrador pode consultar o histórico de compras de qualquer cliente para suporte

**Fluxos Alternativos:**

**3a. Cliente não autenticado:**
- 3a.1. O sistema solicita login
- 3a.2. Após login, redireciona para "Meus Pedidos"

**5a. Pontos insuficientes para resgate:**
- 5a.1. O sistema exibe mensagem informativa
- 5a.2. O sistema mostra quantos pontos faltam

**Exceções:**
- E-1: Erro ao atualizar pontos - registrar para processamento posterior
- E-2: Falha no envio de e-mail - permitir reenvio

---

## 6. Casos de Uso - Funcionalidades Adicionais

### CU-05: Interagir com Conteúdo e Ofertas Especiais

**Identificador:** CU-CONTEUDO-01  
**Nome:** Interagir com Conteúdo e Ofertas Especiais  
**Atores:** Cliente  
**Histórias de Usuário Relacionadas:** HU-11, HU-12, HU-13, HU-16

**Descrição:**
Permite que clientes explorem opções de kits personalizados, consultem FAQs, leiam artigos no blog e se inscrevam em um clube de assinatura.

**Pré-condições:**
- Conteúdo do blog e FAQ disponível
- Kits configurados
- Clube de assinatura ativo

**Pós-condições:**
- Cliente informado
- Kits configurados/adicionados ao carrinho
- Assinatura criada

**Fluxo Principal:**
1. O cliente acessa o site
2. O cliente pode navegar para a seção de "Kits de Presente" para montar um kit
3. O cliente pode acessar a "FAQ" para tirar dúvidas
4. O cliente pode visitar o "Blog" para ler artigos
5. O cliente pode acessar a seção "Clube de Assinatura" para escolher um plano e se inscrever
6. O sistema processa a interação e exibe o conteúdo/configura a assinatura

**Fluxos Alternativos:**

**2a. Kit com preço mínimo não atingido:**
- 2a.1. O sistema exibe mensagem informativa
- 2a.2. O cliente adiciona mais itens

**5a. Assinatura com pagamento falhado:**
- 5a.1. O sistema exibe mensagem de erro
- 5a.2. O cliente pode tentar novamente ou escolher outro método

**Exceções:**
- E-1: Conteúdo não encontrado - exibir página 404
- E-2: Erro ao processar assinatura - reverter alterações

---

## 7. Casos de Uso - Atendimento

### CU-06: Obter Suporte ao Cliente

**Identificador:** CU-SUPORTE-01  
**Nome:** Obter Suporte ao Cliente  
**Atores:** Cliente, Equipe de Suporte  
**Histórias de Usuário Relacionadas:** HU-14

**Descrição:**
Permite que os clientes entrem em contato com o suporte para resolver problemas ou tirar dúvidas, via chat ou e-mail.

**Pré-condições:**
- Canais de comunicação configurados
- Equipe de suporte disponível

**Pós-condições:**
- Solicitação de suporte registrada
- Cliente atendido

**Fluxo Principal:**
1. O cliente busca ajuda no site
2. O sistema exibe as opções de contato (chat, formulário de e-mail)
3. O cliente seleciona a opção desejada
4. O cliente interage com o suporte (envia mensagem no chat ou preenche formulário)
5. O sistema encaminha a solicitação para a equipe de suporte
6. A equipe de suporte responde ao cliente
7. O cliente recebe a resposta

**Fluxos Alternativos:**

**2a. Chat fora de horário:**
- 2a.1. O sistema exibe chatbot
- 2a.2. O chatbot tenta resolver ou registra para resposta posterior

**4a. Formulário com dados incompletos:**
- 4a.1. O sistema exibe mensagens de validação
- 4a.2. O cliente completa os dados

**Exceções:**
- E-1: Sistema de chat indisponível - redirecionar para formulário
- E-2: Erro ao enviar mensagem - permitir nova tentativa

---

## 8. Casos de Uso - Gestão e Operações

### CU-07: Administrar e Operar o E-commerce

**Identificador:** CU-ADMIN-01  
**Nome:** Administrar e Operar o E-commerce  
**Atores:** Administrador  
**Histórias de Usuário Relacionadas:** HU-18, HU-19, HU-20, HU-21, HU-23, HU-25

**Descrição:**
Permite que o administrador visualize métricas de vendas, gerencie preços, estoques, pedidos, cupons de desconto, relatórios e configurações de frete.

**Pré-condições:**
- Usuário com permissão de administrador logado

**Pós-condições:**
- Dados operacionais consultados/atualizados
- Configurações aplicadas
- Relatórios gerados

**Fluxo Principal:**
1. O administrador faz login no painel de controle
2. O sistema exibe o painel de vendas com métricas chave
3. O administrador pode navegar para gerenciar produtos (preços/estoque), pedidos, cupons, ou configurar frete
4. O administrador realiza as alterações ou solicita os relatórios
5. O sistema processa a solicitação, valida os dados e aplica as mudanças ou gera os relatórios
6. O sistema confirma a operação

**Fluxos Alternativos:**

**4a. Validação de dados falha:**
- 4a.1. O sistema exibe mensagens de erro
- 4a.2. O administrador corrige os dados
- 4a.3. Retorna ao passo 5

**5a. Relatório muito grande:**
- 5a.1. O sistema sugere aplicar mais filtros
- 5a.2. O sistema processa em background e notifica quando pronto

**Exceções:**
- E-1: Erro ao salvar alterações - reverter e notificar
- E-2: Erro ao gerar relatório - registrar erro e permitir nova tentativa

---

## 9. Casos de Uso - Expedição

### CU-08: Processar Pedidos para Expedição

**Identificador:** CU-EXPEDICAO-01  
**Nome:** Processar Pedidos para Expedição  
**Atores:** Funcionário de Expedição  
**Histórias de Usuário Relacionadas:** HU-26, HU-27, HU-28, HU-29

**Descrição:**
Permite que funcionários da expedição recebam notificações, consultem pedidos aprovados, registrem a saída de produtos do estoque e gerem documentos de envio.

**Pré-condições:**
- Pedidos aprovados no sistema
- Usuário da expedição logado

**Pós-condições:**
- Estoque atualizado
- Pedido pronto para envio
- Documentos de envio gerados

**Fluxo Principal:**
1. O sistema notifica o funcionário da expedição sobre novos pedidos aprovados
2. O funcionário da expedição acessa a lista de pedidos para separação
3. O funcionário da expedição seleciona um pedido e visualiza seus detalhes
4. O funcionário da expedição registra a baixa dos produtos no estoque
5. O funcionário da expedição gera a etiqueta de envio e a nota fiscal
6. O sistema atualiza o status do pedido para "Enviado" ou similar
7. O sistema notifica o cliente

**Fluxos Alternativos:**

**4a. Produto não encontrado no estoque:**
- 4a.1. O sistema exibe alerta
- 4a.2. O funcionário verifica ou notifica administrador

**5a. Erro ao gerar documentos:**
- 5a.1. O sistema exibe mensagem de erro
- 5a.2. O funcionário pode tentar novamente

**Exceções:**
- E-1: Estoque inconsistente - bloquear baixa e notificar
- E-2: Erro ao atualizar status - permitir atualização manual

---

## 10. Casos de Uso - Produção

### CU-09: Gerenciar Lotes de Café Torrado

**Identificador:** CU-PRODUCAO-01  
**Nome:** Gerenciar Lotes de Café Torrado  
**Atores:** Barista/Responsável pela Produção  
**Histórias de Usuário Relacionadas:** HU-30

**Descrição:**
Permite que o responsável pela torrefação registre informações sobre novos lotes de café torrado, monitorando a produção e a qualidade.

**Pré-condições:**
- Usuário com permissão de produção/barista logado

**Pós-condições:**
- Novo lote de café torrado registrado no sistema

**Fluxo Principal:**
1. O barista/responsável acessa a interface de registro de lotes de torra
2. O barista/responsável insere os detalhes do novo lote (data, tipo de grão, peso, nível de torra)
3. O sistema valida os dados
4. O sistema gera um identificador único para o lote e registra as informações
5. O sistema confirma o registro

**Fluxos Alternativos:**

**3a. Dados inválidos:**
- 3a.1. O sistema exibe mensagens de erro
- 3a.2. O barista corrige os dados
- 3a.3. Retorna ao passo 3

**Exceções:**
- E-1: Erro ao salvar registro - permitir nova tentativa
- E-2: Sistema indisponível - salvar dados localmente e sincronizar depois

---

## 11. Diagrama de Casos de Uso

### 11.1 Atores Principais

- **Cliente**: Usuário final que compra produtos
- **Administrador**: Gerencia o e-commerce
- **Funcionário de Expedição**: Processa pedidos
- **Barista/Produção**: Registra lotes de torra
- **Equipe de Suporte**: Atende clientes

### 11.2 Relacionamentos

```
Cliente ──< CU-01, CU-02, CU-03, CU-04, CU-05, CU-06
Administrador ──< CU-01, CU-02, CU-04, CU-07
Funcionário Expedição ──< CU-08
Barista ──< CU-09
Equipe Suporte ──< CU-06
```

---

## 12. Matriz de Rastreabilidade

| CU | Nome | Atores | HUs Relacionadas |
|----|------|--------|------------------|
| CU-01 | Gerenciar Contas | Cliente, Admin | HU-01, HU-24 |
| CU-02 | Interagir Catálogo | Cliente, Admin | HU-02, HU-05, HU-15 |
| CU-03 | Carrinho e Checkout | Cliente | HU-03, HU-06, HU-07, HU-08 |
| CU-04 | Pós-Venda | Cliente, Admin | HU-04, HU-09, HU-10, HU-22 |
| CU-05 | Conteúdo e Ofertas | Cliente | HU-11, HU-12, HU-13, HU-16 |
| CU-06 | Suporte | Cliente, Suporte | HU-14 |
| CU-07 | Administrar E-commerce | Admin | HU-18, HU-19, HU-20, HU-21, HU-23, HU-25 |
| CU-08 | Expedição | Expedição | HU-26, HU-27, HU-28, HU-29 |
| CU-09 | Produção | Barista | HU-30 |

---

## 13. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Validar casos de uso com stakeholders
- Detalhar fluxos alternativos adicionais
- Criar diagramas visuais de casos de uso
- Mapear para requisitos funcionais


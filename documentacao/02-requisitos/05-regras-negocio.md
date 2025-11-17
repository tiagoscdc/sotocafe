# Regras de Negócio
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha  
**RGM:** 44030509

---

## 1. Introdução

Este documento apresenta as regras de negócio do sistema Soto Café, organizadas por módulo funcional. As regras de negócio definem as políticas, restrições e comportamentos que o sistema deve seguir para atender aos requisitos do negócio.

---

## 2. Regras de Negócio - Gestão de Usuários

### RN-001: E-mail Único
**Descrição:** Cada e-mail pode ser cadastrado apenas uma vez no sistema.  
**Aplicação:** Cadastro de usuários, atualização de e-mail  
**Prioridade:** Alta  
**Validação:** Verificar se e-mail já existe antes de criar/atualizar conta

### RN-002: Criptografia de Senha
**Descrição:** Senhas devem ser criptografadas usando algoritmo de hash seguro (bcrypt, Argon2) antes de armazenamento.  
**Aplicação:** Cadastro, alteração de senha  
**Prioridade:** Alta  
**Validação:** Senha nunca deve ser armazenada em texto plano

### RN-003: Conta Inativa
**Descrição:** Contas inativas não podem fazer login no sistema.  
**Aplicação:** Autenticação  
**Prioridade:** Alta  
**Validação:** Verificar status da conta antes de permitir login

### RN-004: Bloqueio por Tentativas
**Descrição:** Após 5 tentativas de login falhadas, a conta deve ser bloqueada temporariamente por 30 minutos.  
**Aplicação:** Autenticação  
**Prioridade:** Média  
**Validação:** Contar tentativas falhadas e aplicar bloqueio

### RN-005: Permissões de Acesso
**Descrição:** Cada perfil de usuário tem acesso restrito a funcionalidades específicas do sistema.  
**Aplicação:** Todas as funcionalidades administrativas  
**Prioridade:** Alta  
**Validação:** Verificar permissões antes de permitir acesso

---

## 3. Regras de Negócio - Catálogo de Produtos

### RN-006: Categorização de Produtos
**Descrição:** A categorização dos produtos deve seguir a estrutura de classes definida pela gestão de estoque.  
**Aplicação:** Cadastro e edição de produtos  
**Prioridade:** Alta  
**Validação:** Produto deve pertencer a uma categoria válida

### RN-007: Exibição de Produtos Sem Estoque
**Descrição:** Produtos sem estoque podem ser exibidos com etiqueta "Indisponível" ou ocultados, conforme configuração administrativa.  
**Aplicação:** Exibição de produtos no catálogo  
**Prioridade:** Média  
**Validação:** Verificar estoque e aplicar regra de exibição

### RN-008: Preço Não Negativo
**Descrição:** O preço de um produto deve ser sempre maior que zero.  
**Aplicação:** Cadastro e edição de produtos  
**Prioridade:** Alta  
**Validação:** Validar que preço > 0

### RN-009: Estoque Não Negativo
**Descrição:** O estoque de um produto não pode ser negativo.  
**Aplicação:** Atualização de estoque, baixa de estoque  
**Prioridade:** Alta  
**Validação:** Verificar estoque antes de permitir baixa

### RN-010: SKU Único
**Descrição:** Cada produto deve ter um SKU (código) único no sistema.  
**Aplicação:** Cadastro de produtos  
**Prioridade:** Alta  
**Validação:** Verificar unicidade do SKU

---

## 4. Regras de Negócio - Carrinho e Checkout

### RN-011: Quantidade Máxima no Carrinho
**Descrição:** Não é possível adicionar ao carrinho uma quantidade maior do que a disponível em estoque.  
**Aplicação:** Adição ao carrinho, atualização de quantidade  
**Prioridade:** Alta  
**Validação:** Verificar disponibilidade antes de adicionar/atualizar

### RN-012: Preço no Carrinho
**Descrição:** O preço do produto no carrinho deve refletir o preço atual de venda no momento da adição.  
**Aplicação:** Adição ao carrinho  
**Prioridade:** Alta  
**Validação:** Usar preço atual do produto

### RN-013: Persistência do Carrinho
**Descrição:** O carrinho deve ser persistente por 24 horas ou até a finalização da compra.  
**Aplicação:** Gerenciamento de carrinho  
**Prioridade:** Média  
**Validação:** Manter carrinho em sessão ou banco de dados

### RN-014: Validação de Cupom
**Descrição:** Cupons devem ser validados quanto à validade, limite de uso e aplicabilidade antes de serem aplicados.  
**Aplicação:** Aplicação de cupom  
**Prioridade:** Alta  
**Validação:** Verificar data, limite e regras de aplicação

### RN-015: Tipo de Desconto
**Descrição:** Cupons podem ser percentuais (ex: 10% OFF) ou de valor fixo (ex: R$20 OFF).  
**Aplicação:** Criação e aplicação de cupom  
**Prioridade:** Alta  
**Validação:** Aplicar desconto conforme tipo configurado

### RN-016: Limite de Uso de Cupom
**Descrição:** Cada cupom pode ter limite de uso total e/ou por cliente.  
**Aplicação:** Aplicação de cupom  
**Prioridade:** Média  
**Validação:** Verificar limites antes de aplicar

### RN-017: Valor Mínimo para Cupom
**Descrição:** Cupons podem exigir um valor mínimo de pedido para serem aplicados.  
**Aplicação:** Aplicação de cupom  
**Prioridade:** Média  
**Validação:** Verificar valor do pedido antes de aplicar

### RN-018: Cálculo de Frete
**Descrição:** O cálculo de frete deve considerar peso, dimensões, CEP de origem/destino e regras configuradas.  
**Aplicação:** Cálculo de frete  
**Prioridade:** Alta  
**Validação:** Aplicar regras de cálculo configuradas

### RN-019: Frete Grátis
**Descrição:** Pode haver regra de frete grátis acima de determinado valor ou para CEPs específicos.  
**Aplicação:** Cálculo de frete  
**Prioridade:** Média  
**Validação:** Verificar condições de frete grátis

### RN-020: Processamento de Pagamento
**Descrição:** Pagamentos via Pix e Cartão de Crédito devem ter validação em tempo real. Boleto tem prazo de compensação.  
**Aplicação:** Processamento de pagamento  
**Prioridade:** Alta  
**Validação:** Processar conforme método de pagamento

---

## 5. Regras de Negócio - Pedidos

### RN-021: Criação de Pedido
**Descrição:** Um pedido só pode ser criado após confirmação do pagamento (ou geração do boleto).  
**Aplicação:** Finalização de compra  
**Prioridade:** Alta  
**Validação:** Verificar status do pagamento antes de criar pedido

### RN-022: Atualização de Status
**Descrição:** A atualização dos status de pedido pode ser manual (equipe) ou automatizada (integração transportadora).  
**Aplicação:** Gerenciamento de pedidos  
**Prioridade:** Alta  
**Validação:** Permitir atualização conforme permissões

### RN-023: Código de Rastreamento
**Descrição:** Apenas pedidos com status "Enviado" ou superior devem exibir código de rastreamento.  
**Aplicação:** Acompanhamento de pedido  
**Prioridade:** Média  
**Validação:** Verificar status antes de exibir código

### RN-024: Cancelamento de Pedido
**Descrição:** Ao cancelar um pedido, o estoque deve ser revertido e o pagamento estornado (se aplicável).  
**Aplicação:** Cancelamento de pedido  
**Prioridade:** Alta  
**Validação:** Reverter estoque e processar estorno

### RN-025: Número de Pedido Único
**Descrição:** Cada pedido deve ter um número único gerado automaticamente.  
**Aplicação:** Criação de pedido  
**Prioridade:** Alta  
**Validação:** Gerar número único sequencial

---

## 6. Regras de Negócio - Estoque

### RN-026: Reserva de Estoque
**Descrição:** Ao adicionar produto ao carrinho, o estoque deve ser reservado temporariamente.  
**Aplicação:** Adição ao carrinho  
**Prioridade:** Média  
**Validação:** Reservar estoque por tempo limitado

### RN-027: Baixa de Estoque
**Descrição:** A baixa de estoque só pode ser realizada por funcionários autorizados da expedição.  
**Aplicação:** Processamento de pedido  
**Prioridade:** Alta  
**Validação:** Verificar permissões antes de permitir baixa

### RN-028: Quantidade na Baixa
**Descrição:** A quantidade baixada deve corresponder exatamente à quantidade do pedido.  
**Aplicação:** Baixa de estoque  
**Prioridade:** Alta  
**Validação:** Validar quantidade antes de baixar

### RN-029: Estoque Mínimo
**Descrição:** Quando o estoque de um produto atingir o estoque mínimo, o sistema deve gerar alerta.  
**Aplicação:** Atualização de estoque  
**Prioridade:** Média  
**Validação:** Verificar estoque mínimo após atualização

---

## 7. Regras de Negócio - Programa de Fidelidade

### RN-030: Conversão de Pontos
**Descrição:** A regra de conversão de valor gasto para pontos deve ser configurável (ex: R$1 gasto = 1 ponto).  
**Aplicação:** Acúmulo de pontos  
**Prioridade:** Média  
**Validação:** Aplicar regra configurada

### RN-031: Resgate de Pontos
**Descrição:** A regra de resgate de pontos deve ser configurável (ex: 100 pontos = R$5 de desconto).  
**Aplicação:** Resgate de pontos  
**Prioridade:** Média  
**Validação:** Aplicar regra configurada

### RN-032: Validade de Pontos
**Descrição:** Pontos podem ter validade configurável. Pontos expirados devem ser removidos automaticamente.  
**Aplicação:** Gerenciamento de pontos  
**Prioridade:** Baixa  
**Validação:** Verificar validade ao resgatar pontos

### RN-033: Acúmulo de Pontos
**Descrição:** Pontos devem ser acumulados automaticamente após confirmação do pagamento do pedido.  
**Aplicação:** Finalização de pedido  
**Prioridade:** Média  
**Validação:** Calcular e adicionar pontos após pagamento

---

## 8. Regras de Negócio - Clube de Assinatura

### RN-034: Configuração de Planos
**Descrição:** Os planos de assinatura devem ser configuráveis (preço, frequência, tipo de café).  
**Aplicação:** Gerenciamento de assinaturas  
**Prioridade:** Média  
**Validação:** Permitir configuração flexível

### RN-035: Pagamento Recorrente
**Descrição:** O sistema deve gerenciar pagamentos recorrentes e notificar sobre falhas no pagamento.  
**Aplicação:** Processamento de assinatura  
**Prioridade:** Alta  
**Validação:** Processar pagamento conforme frequência

### RN-036: Pausa de Assinatura
**Descrição:** Clientes podem pausar assinaturas temporariamente sem perder benefícios.  
**Aplicação:** Gerenciamento de assinatura  
**Prioridade:** Baixa  
**Validação:** Permitir pausa e retomada

### RN-037: Cancelamento de Assinatura
**Descrição:** Ao cancelar assinatura, não devem ser gerados novos pedidos, mas pedidos já gerados devem ser processados.  
**Aplicação:** Cancelamento de assinatura  
**Prioridade:** Média  
**Validação:** Processar cancelamento respeitando pedidos existentes

---

## 9. Regras de Negócio - Notificações

### RN-038: E-mail de Confirmação
**Descrição:** E-mail de confirmação deve ser enviado somente após confirmação do pagamento (ou geração do boleto).  
**Aplicação:** Finalização de compra  
**Prioridade:** Alta  
**Validação:** Verificar status do pagamento antes de enviar

### RN-039: Notificações de Status
**Descrição:** O sistema deve enviar notificações por e-mail a cada mudança de status importante do pedido.  
**Aplicação:** Atualização de status  
**Prioridade:** Média  
**Validação:** Enviar e-mail para status configurados

### RN-040: Notificações de Expedição
**Descrição:** Apenas pedidos com status "Aprovado" devem gerar notificação para a expedição.  
**Aplicação:** Processamento de pedido  
**Prioridade:** Alta  
**Validação:** Verificar status antes de notificar

---

## 10. Regras de Negócio - Relatórios

### RN-041: Acesso a Relatórios
**Descrição:** Apenas administradores podem gerar relatórios.  
**Aplicação:** Geração de relatórios  
**Prioridade:** Alta  
**Validação:** Verificar permissões antes de gerar

### RN-042: Consistência de Dados
**Descrição:** Os dados dos relatórios devem ser consistentes com os dados de vendas.  
**Aplicação:** Geração de relatórios  
**Prioridade:** Alta  
**Validação:** Usar dados transacionais reais

---

## 11. Regras de Negócio - Produção

### RN-043: Registro de Torra
**Descrição:** Apenas usuários com perfil "Barista" ou "Produção" podem registrar torras.  
**Aplicação:** Registro de lotes  
**Prioridade:** Média  
**Validação:** Verificar permissões antes de permitir registro

### RN-044: Código de Lote Único
**Descrição:** Cada lote de torra deve ter um código único gerado automaticamente.  
**Aplicação:** Registro de lote  
**Prioridade:** Média  
**Validação:** Gerar código único

### RN-045: Rastreabilidade
**Descrição:** Lotes de torra devem poder ser associados a produtos para rastreabilidade.  
**Aplicação:** Associação de lote a produto  
**Prioridade:** Baixa  
**Validação:** Permitir associação opcional

---

## 12. Regras de Negócio - Segurança

### RN-046: Dados de Pagamento
**Descrição:** Dados de pagamento não devem ser armazenados localmente. Usar tokenização.  
**Aplicação:** Processamento de pagamento  
**Prioridade:** Alta  
**Validação:** Não armazenar dados sensíveis

### RN-047: Auditoria
**Descrição:** Ações administrativas críticas devem ser registradas para auditoria.  
**Aplicação:** Operações administrativas  
**Prioridade:** Média  
**Validação:** Registrar ações importantes

### RN-048: Sessão Expirada
**Descrição:** Sessões devem expirar após 30 minutos de inatividade.  
**Aplicação:** Autenticação  
**Prioridade:** Média  
**Validação:** Verificar tempo de inatividade

---

## 13. Regras de Negócio - Kits Personalizados

### RN-049: Limitação de Itens
**Descrição:** A seleção de itens para kits pode ser limitada a produtos específicos ou categorias.  
**Aplicação:** Montagem de kit  
**Prioridade:** Baixa  
**Validação:** Validar produtos permitidos

### RN-050: Preço do Kit
**Descrição:** Pode haver preço mínimo ou máximo para kits personalizados.  
**Aplicação:** Montagem de kit  
**Prioridade:** Baixa  
**Validação:** Validar preço total do kit

---

## 14. Matriz de Prioridades

| RN | Descrição | Prioridade | Módulo |
|----|-----------|------------|--------|
| RN-001 | E-mail Único | Alta | Usuários |
| RN-002 | Criptografia de Senha | Alta | Usuários |
| RN-003 | Conta Inativa | Alta | Usuários |
| RN-004 | Bloqueio por Tentativas | Média | Usuários |
| RN-005 | Permissões de Acesso | Alta | Usuários |
| RN-006 | Categorização | Alta | Catálogo |
| RN-007 | Exibição Sem Estoque | Média | Catálogo |
| RN-008 | Preço Não Negativo | Alta | Catálogo |
| RN-009 | Estoque Não Negativo | Alta | Estoque |
| RN-010 | SKU Único | Alta | Catálogo |
| RN-011 | Quantidade Máxima | Alta | Carrinho |
| RN-012 | Preço no Carrinho | Alta | Carrinho |
| RN-013 | Persistência Carrinho | Média | Carrinho |
| RN-014 | Validação de Cupom | Alta | Cupons |
| RN-015 | Tipo de Desconto | Alta | Cupons |
| RN-016 | Limite de Uso | Média | Cupons |
| RN-017 | Valor Mínimo | Média | Cupons |
| RN-018 | Cálculo de Frete | Alta | Frete |
| RN-019 | Frete Grátis | Média | Frete |
| RN-020 | Processamento Pagamento | Alta | Pagamento |
| RN-021 | Criação de Pedido | Alta | Pedidos |
| RN-022 | Atualização Status | Alta | Pedidos |
| RN-023 | Código Rastreamento | Média | Pedidos |
| RN-024 | Cancelamento | Alta | Pedidos |
| RN-025 | Número Único | Alta | Pedidos |
| RN-026 | Reserva Estoque | Média | Estoque |
| RN-027 | Baixa Estoque | Alta | Estoque |
| RN-028 | Quantidade Baixa | Alta | Estoque |
| RN-029 | Estoque Mínimo | Média | Estoque |
| RN-030 | Conversão Pontos | Média | Fidelidade |
| RN-031 | Resgate Pontos | Média | Fidelidade |
| RN-032 | Validade Pontos | Baixa | Fidelidade |
| RN-033 | Acúmulo Pontos | Média | Fidelidade |
| RN-034 | Configuração Planos | Média | Assinatura |
| RN-035 | Pagamento Recorrente | Alta | Assinatura |
| RN-036 | Pausa Assinatura | Baixa | Assinatura |
| RN-037 | Cancelamento Assinatura | Média | Assinatura |
| RN-038 | E-mail Confirmação | Alta | Notificações |
| RN-039 | Notificações Status | Média | Notificações |
| RN-040 | Notificações Expedição | Alta | Notificações |
| RN-041 | Acesso Relatórios | Alta | Relatórios |
| RN-042 | Consistência Dados | Alta | Relatórios |
| RN-043 | Registro Torra | Média | Produção |
| RN-044 | Código Lote Único | Média | Produção |
| RN-045 | Rastreabilidade | Baixa | Produção |
| RN-046 | Dados Pagamento | Alta | Segurança |
| RN-047 | Auditoria | Média | Segurança |
| RN-048 | Sessão Expirada | Média | Segurança |
| RN-049 | Limitação Itens | Baixa | Kits |
| RN-050 | Preço Kit | Baixa | Kits |

---

## 15. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Validar regras com stakeholders
- Implementar validações no sistema
- Documentar exceções e tratamentos
- Criar testes para validar regras


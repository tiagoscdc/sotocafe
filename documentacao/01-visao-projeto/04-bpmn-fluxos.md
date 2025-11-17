# BPMN - Fluxos de Processo
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha  
**RGM:** 44030509

---

## 1. Introdução

Este documento apresenta os fluxos de processo do sistema Soto Café utilizando a notação BPMN (Business Process Modeling Notation). Os diagramas descrevem os principais processos de negócio do e-commerce.

---

## 2. Processo: Compra de Produto (Cliente)

### 2.1 Descrição
Processo completo de compra de um produto, desde a navegação até a confirmação do pedido.

### 2.2 Participantes
- Cliente
- Sistema
- Gateway de Pagamento

### 2.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Cliente acessa o site

**Atividades:**
1. Navegar pelo catálogo
2. Buscar produto
3. Visualizar detalhes do produto
4. Adicionar produto ao carrinho
5. Revisar carrinho
6. Aplicar cupom (opcional)
7. Calcular frete
8. Selecionar endereço de entrega
9. Escolher forma de pagamento
10. Inserir dados de pagamento
11. Processar pagamento
12. Confirmar pedido

**Decisões:**
- Produto disponível? (Sim/Não)
- Cliente autenticado? (Sim/Não)
- Cupom válido? (Sim/Não)
- Pagamento aprovado? (Sim/Não)

**Fim:**
- Pedido confirmado
- E-mail de confirmação enviado

---

## 3. Processo: Processamento de Pedido (Backoffice)

### 3.1 Descrição
Processo de processamento de um pedido desde a aprovação do pagamento até o envio.

### 3.2 Participantes
- Sistema
- Administrador
- Equipe de Expedição
- Transportadora

### 3.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Pagamento aprovado

**Atividades:**
1. Sistema notifica expedição
2. Expedição visualiza pedido
3. Verificar disponibilidade de estoque
4. Separar produtos
5. Registrar baixa de estoque
6. Embalar pedido
7. Gerar etiqueta de envio
8. Gerar nota fiscal
9. Atualizar status para "Enviado"
10. Enviar código de rastreamento ao cliente

**Decisões:**
- Estoque disponível? (Sim/Não)
- Todos os itens separados? (Sim/Não)
- Documentos gerados? (Sim/Não)

**Fim:**
- Pedido enviado
- Cliente notificado

---

## 4. Processo: Cadastro de Usuário

### 4.1 Descrição
Processo de cadastro de novo usuário no sistema.

### 4.2 Participantes
- Cliente
- Sistema
- Serviço de E-mail

### 4.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Cliente acessa página de cadastro

**Atividades:**
1. Preencher formulário de cadastro
2. Validar dados
3. Verificar e-mail único
4. Criptografar senha
5. Criar conta
6. Gerar token de ativação
7. Enviar e-mail de confirmação
8. Cliente clica no link de ativação
9. Validar token
10. Ativar conta

**Decisões:**
- Dados válidos? (Sim/Não)
- E-mail único? (Sim/Não)
- Token válido? (Sim/Não)

**Fim:**
- Conta ativada
- Cliente pode fazer login

---

## 5. Processo: Gerenciamento de Estoque

### 5.1 Descrição
Processo de atualização e controle de estoque de produtos.

### 5.2 Participantes
- Administrador
- Sistema
- Equipe de Expedição

### 5.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Necessidade de atualizar estoque

**Atividades:**
1. Administrador acessa gestão de produtos
2. Selecionar produto
3. Atualizar quantidade
4. Validar quantidade (não negativa)
5. Atualizar estoque no sistema
6. Verificar estoque mínimo
7. Gerar alerta se abaixo do mínimo (se aplicável)
8. Atualizar disponibilidade no site

**Decisões:**
- Quantidade válida? (Sim/Não)
- Abaixo do mínimo? (Sim/Não)

**Fim:**
- Estoque atualizado
- Site atualizado

---

## 6. Processo: Aplicação de Cupom de Desconto

### 6.1 Descrição
Processo de validação e aplicação de cupom de desconto em um pedido.

### 6.2 Participantes
- Cliente
- Sistema

### 6.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Cliente insere código de cupom

**Atividades:**
1. Cliente insere código
2. Buscar cupom no sistema
3. Verificar se cupom existe
4. Verificar se cupom está ativo
5. Verificar data de validade
6. Verificar limite de uso
7. Verificar se cliente já usou (se aplicável)
8. Verificar valor mínimo do pedido
9. Aplicar desconto
10. Atualizar valor total

**Decisões:**
- Cupom existe? (Sim/Não)
- Cupom ativo? (Sim/Não)
- Dentro da validade? (Sim/Não)
- Limite não excedido? (Sim/Não)
- Valor mínimo atendido? (Sim/Não)

**Fim:**
- Desconto aplicado
- Valor atualizado

---

## 7. Processo: Clube de Assinatura

### 7.1 Descrição
Processo de assinatura e processamento de entregas recorrentes.

### 7.2 Participantes
- Cliente
- Sistema
- Gateway de Pagamento

### 7.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Cliente acessa página do clube

**Atividades:**
1. Visualizar planos disponíveis
2. Selecionar plano
3. Configurar frequência
4. Escolher produtos (se aplicável)
5. Configurar pagamento recorrente
6. Processar pagamento inicial
7. Criar assinatura
8. Agendar próxima entrega
9. Processar entrega recorrente (mensalmente)
10. Verificar pagamento
11. Gerar pedido automático
12. Processar pedido

**Decisões:**
- Pagamento aprovado? (Sim/Não)
- Assinatura ativa? (Sim/Não)
- Cliente cancelou? (Sim/Não)

**Fim:**
- Assinatura criada
- Entregas agendadas

---

## 8. Processo: Atendimento ao Cliente

### 8.1 Descrição
Processo de atendimento a solicitações e dúvidas dos clientes.

### 8.2 Participantes
- Cliente
- Sistema
- Equipe de Suporte

### 8.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Cliente busca ajuda

**Atividades:**
1. Cliente acessa FAQ ou contato
2. Buscar na FAQ
3. Encontrar resposta? (Decisão)
4. Se não encontrou, abrir chat ou formulário
5. Equipe recebe solicitação
6. Analisar solicitação
7. Responder cliente
8. Registrar interação
9. Cliente satisfeito? (Decisão)
10. Encerrar atendimento

**Decisões:**
- Resposta encontrada? (Sim/Não)
- Cliente satisfeito? (Sim/Não)

**Fim:**
- Solicitação resolvida
- Registro salvo

---

## 9. Processo: Geração de Relatórios

### 9.1 Descrição
Processo de geração de relatórios de vendas e operações.

### 9.2 Participantes
- Administrador
- Sistema

### 9.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Administrador acessa seção de relatórios

**Atividades:**
1. Selecionar tipo de relatório
2. Definir período
3. Aplicar filtros
4. Processar dados
5. Gerar relatório
6. Visualizar relatório
7. Exportar (se necessário)
8. Salvar configuração (opcional)

**Decisões:**
- Dados disponíveis? (Sim/Não)
- Exportar? (Sim/Não)

**Fim:**
- Relatório gerado
- Dados disponíveis

---

## 10. Processo: Registro de Torra (Produção)

### 10.1 Descrição
Processo de registro de novos lotes de café torrado.

### 10.2 Participantes
- Barista/Produção
- Sistema

### 10.3 Fluxo BPMN (Descrição Textual)

**Início:**
- Nova torra realizada

**Atividades:**
1. Barista acessa interface de registro
2. Preencher dados do lote
3. Informar tipo de grão
4. Informar peso inicial
5. Informar peso final
6. Informar nível de torra
7. Adicionar observações
8. Gerar código único do lote
9. Salvar registro
10. Associar lote a produtos (se aplicável)

**Decisões:**
- Dados completos? (Sim/Não)
- Associar a produtos? (Sim/Não)

**Fim:**
- Lote registrado
- Rastreabilidade garantida

---

## 11. Legenda BPMN

### 11.1 Elementos Utilizados

**Eventos:**
- ⭕ **Evento Inicial**: Início do processo
- ⭕ **Evento Final**: Fim do processo
- ⭕ **Evento Intermediário**: Evento durante o processo

**Atividades:**
- ⬜ **Tarefa**: Atividade única
- ⬜ **Subprocesso**: Processo dentro de outro processo

**Gateways (Decisões):**
- ◇ **Exclusivo (XOR)**: Escolha entre alternativas
- ◇ **Inclusivo (OR)**: Múltiplas alternativas possíveis
- ◇ **Paralelo (AND)**: Todas as alternativas executadas

**Fluxos:**
- → **Fluxo de Sequência**: Ordem de execução
- → **Fluxo de Mensagem**: Comunicação entre participantes

**Participantes:**
- 📦 **Pool**: Participante do processo
- 📦 **Lane**: Divisão dentro de um participante

---

## 12. Diagramas Visuais

> **Nota**: Os diagramas BPMN visuais completos devem ser criados utilizando ferramentas especializadas como:
> - Bizagi Modeler
> - Camunda Modeler
> - Lucidchart
> - Draw.io
> - Microsoft Visio

**Recomendação**: Criar os diagramas visuais em formato .bpmn ou imagem (PNG/SVG) e anexar a este documento.

---

## 13. Melhorias e Otimizações

### 13.1 Oportunidades de Automação

1. **Processamento de Pedidos**: Automação parcial com alertas
2. **Cálculo de Frete**: Totalmente automatizado
3. **Aplicação de Cupons**: Totalmente automatizado
4. **Geração de Relatórios**: Agendamento automático

### 13.2 Pontos de Melhoria

1. Reduzir tempo de processamento de pedidos
2. Melhorar comunicação com clientes
3. Otimizar gestão de estoque
4. Automatizar mais processos

---

## 14. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Criar diagramas BPMN visuais
- Validar fluxos com stakeholders
- Implementar melhorias identificadas
- Documentar exceções e tratamentos de erro


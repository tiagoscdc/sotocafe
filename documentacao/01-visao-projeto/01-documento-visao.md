# Documento de Visão do Projeto
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha  
**RGM:** 44030509

---

## 1. Introdução

### 1.1 Propósito do Documento

Este documento apresenta a visão geral do projeto Soto Café, um e-commerce especializado em cafés gourmet. O documento descreve o problema que o sistema resolve, as necessidades dos stakeholders, os objetivos do projeto e as funcionalidades principais.

### 1.2 Escopo do Projeto

O projeto consiste no desenvolvimento de uma plataforma de e-commerce completa para venda de cafés gourmet, incluindo:

- Catálogo de produtos (cafés em grão, moído, cápsulas, kits e acessórios)
- Sistema de carrinho e checkout
- Gestão de pedidos e expedição
- Programa de fidelidade
- Painel administrativo completo
- Sistema de assinaturas (clube de café)
- Blog e conteúdo educativo sobre café

### 1.3 Definições, Acrônimos e Abreviações

- **BMC**: Business Model Canvas
- **BPMN**: Business Process Modeling Notation
- **DT**: Design Thinking
- **HU**: História de Usuário
- **UAT**: User Acceptance Test (Teste de Aceitação do Usuário)
- **TDD**: Test-Driven Development (Desenvolvimento Orientado a Testes)
- **API**: Application Programming Interface
- **CMS**: Content Management System
- **CRM**: Customer Relationship Management
- **PCI-DSS**: Payment Card Industry Data Security Standard

---

## 2. Posicionamento

### 2.1 Oportunidade de Negócio

O mercado de cafés especiais e gourmet está em crescimento no Brasil, com consumidores cada vez mais interessados em qualidade, origem e experiência. A pandemia acelerou a migração para compras online, criando uma oportunidade para cafeterias especializadas expandirem seu alcance através do e-commerce.

### 2.2 Declaração do Problema

Atualmente, a cafeteria Soto Café possui apenas uma loja física, limitando seu alcance geográfico e horário de atendimento. Os clientes que desejam adquirir cafés especiais precisam se deslocar até a loja, o que pode ser inconveniente. Além disso, não há um sistema eficiente para:

- Gerenciar pedidos online
- Oferecer programas de fidelidade
- Personalizar kits de presente
- Gerenciar assinaturas recorrentes
- Fornecer informações detalhadas sobre os produtos

### 2.3 Declaração da Solução

O e-commerce Soto Café será uma plataforma digital completa que permitirá:

- Venda online de cafés gourmet e acessórios
- Experiência de compra personalizada e intuitiva
- Gestão eficiente de pedidos e estoque
- Programa de fidelidade para recompensar clientes
- Clube de assinatura para entrega recorrente
- Conteúdo educativo sobre café
- Painel administrativo para gestão completa do negócio

---

## 3. Descrição dos Stakeholders

### 3.1 Stakeholders Principais

#### 3.1.1 Clientes Finais

**Perfil 1: João Monteiro (34 anos)**
- Analista de suporte, trabalha em home office
- Interesses: Café de qualidade, tecnologia, música instrumental, leitura
- Comportamento: Compra pela internet semanalmente, usa redes sociais para buscar recomendações
- Objetivos: Explorar novos sabores de café sem sair de casa, montar kits customizados
- Frustrações: Sites lentos, falta de informações sobre cafés, frete caro

**Perfil 2: Ana Carolina Silva (27 anos)**
- Designer Gráfica
- Interesses: Estilo, criatividade, presentes com significado, cafés aromáticos
- Comportamento: Muito ativa em redes sociais, busca inspirações visuais
- Objetivos: Encontrar presentes criativos e personalizados
- Frustrações: Falta de opções de personalização, sites com poucas imagens

**Perfil 3: Roberto Martins (58 anos)**
- Aposentado, ex-professor de história
- Interesses: Leitura, cultura, café de qualidade, tecnologia sem complicação
- Comportamento: Usa Google e e-mail com frequência, ainda se adaptando a compras online
- Objetivos: Ter café de qualidade em casa, com entrega prática
- Frustrações: Sites complicados, falta de opção para pagamento via boleto

#### 3.1.2 Administradores do E-commerce

- Proprietários da cafeteria
- Gerentes de operações
- Responsáveis por gestão de produtos, pedidos e relatórios

#### 3.1.3 Funcionários da Expedição

- Equipe responsável pela separação e envio dos pedidos
- Necessitam de interface simples e eficiente para gerenciar expedições

#### 3.1.4 Baristas / Produção

- Responsáveis pela torrefação (se aplicável)
- Necessitam registrar lotes de café torrado para rastreabilidade

---

## 4. Visão Geral do Produto

### 4.1 Perspectiva do Produto

O e-commerce Soto Café é uma plataforma web responsiva que integra:

- **Frontend**: Interface moderna e intuitiva para clientes
- **Backend**: API RESTful para gerenciamento de dados
- **Painel Administrativo**: Interface de gestão completa
- **Sistema de Pagamento**: Integração com gateways de pagamento
- **Sistema de Frete**: Cálculo automático de frete
- **Sistema de Notificações**: E-mails transacionais

### 4.2 Funcionalidades Principais

1. **Gestão de Contas e Acesso**
   - Cadastro e autenticação de usuários
   - Gerenciamento de permissões (clientes, administradores, funcionários)

2. **Navegação e Catálogo**
   - Navegação por categorias
   - Busca de produtos
   - Gerenciamento de catálogo (admin)

3. **Carrinho e Checkout**
   - Carrinho de compras
   - Aplicação de cupons de desconto
   - Cálculo de frete
   - Processamento de pagamento (Cartão, Pix, Boleto)

4. **Pós-Venda e Fidelidade**
   - Acompanhamento de pedidos
   - Programa de pontos
   - Histórico de compras

5. **Funcionalidades Adicionais**
   - Kits de presente personalizáveis
   - Clube de assinatura
   - Blog de conteúdo
   - FAQ

6. **Gestão e Operações**
   - Painel de controle de vendas
   - Gerenciamento de pedidos
   - Relatórios
   - Configuração de frete

7. **Expedição**
   - Lista de pedidos para separação
   - Registro de baixa de estoque
   - Geração de etiquetas e notas fiscais

### 4.3 Características e Benefícios

| Característica | Benefício |
|----------------|-----------|
| Interface responsiva | Acesso de qualquer dispositivo |
| Busca inteligente | Encontrar produtos rapidamente |
| Programa de fidelidade | Recompensar clientes frequentes |
| Clube de assinatura | Receita recorrente e fidelização |
| Painel administrativo completo | Gestão eficiente do negócio |
| Múltiplas formas de pagamento | Facilidade para o cliente |
| Cálculo automático de frete | Transparência nos custos |

---

## 5. Objetivos do Projeto

### 5.1 Objetivos de Negócio

1. Expandir o alcance geográfico da cafeteria
2. Aumentar as vendas através do canal online
3. Melhorar a experiência do cliente
4. Implementar programa de fidelidade para aumentar retenção
5. Criar receita recorrente através do clube de assinatura

### 5.2 Objetivos Técnicos

1. Desenvolver uma plataforma escalável e performática
2. Garantir segurança nas transações
3. Implementar testes automatizados (TDD)
4. Criar documentação completa
5. Seguir boas práticas de desenvolvimento

### 5.3 Objetivos do Usuário

1. Comprar cafés gourmet de forma fácil e rápida
2. Receber informações detalhadas sobre os produtos
3. Acompanhar pedidos em tempo real
4. Participar de programa de fidelidade
5. Personalizar kits de presente

---

## 6. Restrições e Premissas

### 6.1 Restrições

- **Tecnológicas**: Compatibilidade com navegadores modernos (Chrome, Firefox, Safari, Edge)
- **Orçamentárias**: Integração com gateways de pagamento disponíveis no Brasil
- **Temporais**: Desenvolvimento em sprints de 2 semanas
- **Regulatórias**: Conformidade com LGPD (Lei Geral de Proteção de Dados)
- **Segurança**: Conformidade com PCI-DSS para pagamentos

### 6.2 Premissas

- A cafeteria possui estoque físico para atender pedidos online
- Existe equipe de expedição para processar pedidos
- Há integração disponível com transportadoras
- O sistema de pagamento será integrado com gateway brasileiro (ex: PagSeguro, Mercado Pago)
- A torrefação pode ser interna ou externa (funcionalidade opcional)

---

## 7. Riscos

### 7.1 Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Problemas de integração com gateway de pagamento | Média | Alto | Escolher gateway com boa documentação e suporte |
| Performance do sistema com muitos produtos | Baixa | Médio | Implementar cache e otimizações |
| Problemas de segurança | Baixa | Alto | Seguir boas práticas de segurança, auditorias regulares |

### 7.2 Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Baixa adesão inicial | Média | Médio | Campanha de marketing, programa de lançamento |
| Problemas logísticos de entrega | Média | Alto | Parcerias com transportadoras confiáveis |
| Concorrência | Alta | Médio | Diferenciação através de qualidade e experiência |

---

## 8. Referências

- Documento original do projeto integrador
- Business Model Canvas (BMC)
- Design Thinking - Personas e jornadas
- BPMN - Fluxos de processo
- Histórias de Usuário (30 HUs definidas)

---

## 9. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |
| [Nome] | [Cargo] | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Revisar e aprovar este documento
- Iniciar detalhamento dos requisitos funcionais
- Definir arquitetura técnica do sistema


# Requisitos Não Funcionais
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha

---

## 1. Introdução

Este documento descreve os requisitos não funcionais (RNF) do sistema Soto Café. Os requisitos não funcionais definem as características de qualidade, desempenho, segurança e outras propriedades do sistema que não estão diretamente relacionadas às funcionalidades.

---

## 2. Requisitos de Performance

### RNF-PERF-001: Tempo de Resposta

**Descrição:** O sistema deve responder às requisições do usuário dentro de tempos aceitáveis.

**Especificações:**
- Página inicial: carregar em até 2 segundos
- Páginas de categoria: carregar em até 2 segundos
- Página de produto: carregar em até 1,5 segundos
- Busca de produtos: resultados em até 1 segundo
- Adição ao carrinho: processar em até 1 segundo
- Cálculo de frete: processar em até 2 segundos
- Processamento de pagamento (Pix/Cartão): processar em até 3 segundos
- Login: processar em até 2 segundos
- Cadastro: processar em até 5 segundos
- Painel administrativo: carregar em até 3 segundos
- Página "Meus Pedidos": carregar em até 3 segundos

**Prioridade:** Alta

---

### RNF-PERF-002: Throughput

**Descrição:** O sistema deve suportar um número mínimo de requisições simultâneas.

**Especificações:**
- Suportar pelo menos 100 usuários simultâneos navegando
- Suportar pelo menos 50 transações de pagamento simultâneas
- Processar pelo menos 1000 requisições por minuto

**Prioridade:** Média

---

### RNF-PERF-003: Escalabilidade

**Descrição:** O sistema deve ser capaz de escalar para suportar crescimento.

**Especificações:**
- Arquitetura deve permitir escalonamento horizontal
- Banco de dados deve suportar crescimento de dados sem degradação significativa
- Sistema deve suportar aumento de 10x no volume de transações sem refatoração completa

**Prioridade:** Alta

---

## 3. Requisitos de Disponibilidade

### RNF-DISP-001: Uptime

**Descrição:** O sistema deve estar disponível durante a maior parte do tempo.

**Especificações:**
- Disponibilidade mínima de 99,5% (aproximadamente 3,6 horas de downtime por mês)
- Manutenções programadas devem ser realizadas em horários de baixo tráfego
- Sistema deve ter redundância para evitar pontos únicos de falha

**Prioridade:** Alta

---

### RNF-DISP-002: Recuperação de Falhas

**Descrição:** O sistema deve se recuperar rapidamente de falhas.

**Especificações:**
- Tempo médio de recuperação (MTTR) de no máximo 1 hora
- Sistema deve ter backup automático dos dados
- Backup deve ser testado regularmente

**Prioridade:** Alta

---

## 4. Requisitos de Segurança

### RNF-SEG-001: Autenticação e Autorização

**Descrição:** O sistema deve garantir que apenas usuários autorizados acessem funcionalidades.

**Especificações:**
- Senhas devem ser criptografadas usando algoritmo de hash seguro (bcrypt, Argon2)
- Sessões devem ser gerenciadas de forma segura
- Tokens de autenticação devem expirar após período de inatividade
- Implementar proteção contra ataques de força bruta (rate limiting)

**Prioridade:** Alta

---

### RNF-SEG-002: Proteção de Dados

**Descrição:** Dados sensíveis devem ser protegidos.

**Especificações:**
- Todas as comunicações devem usar HTTPS (TLS 1.2 ou superior)
- Dados de pagamento não devem ser armazenados localmente (usar tokenização)
- Dados pessoais devem estar em conformidade com LGPD
- Implementar criptografia de dados sensíveis em repouso

**Prioridade:** Alta

---

### RNF-SEG-003: Conformidade PCI-DSS

**Descrição:** O sistema deve estar em conformidade com padrões de segurança para pagamentos.

**Especificações:**
- Integração com gateway de pagamento deve seguir padrões PCI-DSS
- Dados de cartão de crédito não devem ser armazenados no sistema
- Processamento de pagamento deve ser feito através de gateway certificado

**Prioridade:** Alta

---

### RNF-SEG-004: Proteção contra Ataques

**Descrição:** O sistema deve estar protegido contra ataques comuns.

**Especificações:**
- Proteção contra SQL Injection
- Proteção contra XSS (Cross-Site Scripting)
- Proteção contra CSRF (Cross-Site Request Forgery)
- Implementar rate limiting para prevenir DDoS
- Validação de entrada de dados

**Prioridade:** Alta

---

## 5. Requisitos de Usabilidade

### RNF-USAB-001: Interface Intuitiva

**Descrição:** A interface deve ser fácil de usar e intuitiva.

**Especificações:**
- Interface deve seguir padrões de design web modernos
- Navegação deve ser clara e consistente
- Mensagens de erro devem ser claras e acionáveis
- Feedback visual deve ser fornecido para ações do usuário

**Prioridade:** Alta

---

### RNF-USAB-002: Responsividade

**Descrição:** O sistema deve funcionar bem em diferentes dispositivos.

**Especificações:**
- Interface deve ser totalmente responsiva
- Funcionalidade completa em smartphones, tablets e desktops
- Elementos interativos devem ter tamanho adequado para toque
- Layout deve se adaptar a diferentes tamanhos de tela

**Prioridade:** Alta

---

### RNF-USAB-003: Acessibilidade

**Descrição:** O sistema deve ser acessível para pessoas com deficiências.

**Especificações:**
- Conformidade com WCAG 2.1 nível AA
- Suporte a leitores de tela
- Navegação por teclado
- Contraste adequado de cores
- Textos alternativos para imagens

**Prioridade:** Média

---

## 6. Requisitos de Compatibilidade

### RNF-COMP-001: Navegadores

**Descrição:** O sistema deve funcionar nos principais navegadores.

**Especificações:**
- Google Chrome (últimas 2 versões)
- Mozilla Firefox (últimas 2 versões)
- Safari (últimas 2 versões)
- Microsoft Edge (últimas 2 versões)
- Navegadores móveis (Chrome Mobile, Safari Mobile)

**Prioridade:** Alta

---

### RNF-COMP-002: Sistemas Operacionais

**Descrição:** O sistema deve funcionar em diferentes sistemas operacionais.

**Especificações:**
- Windows 10/11
- macOS (últimas 2 versões)
- Linux (distribuições principais)
- iOS (últimas 2 versões)
- Android (últimas 2 versões)

**Prioridade:** Média

---

## 7. Requisitos de Manutenibilidade

### RNF-MANT-001: Código Limpo

**Descrição:** O código deve ser fácil de manter e modificar.

**Especificações:**
- Código deve seguir padrões de codificação definidos
- Código deve ser bem documentado
- Estrutura de pastas deve ser organizada
- Nomes de variáveis e funções devem ser descritivos

**Prioridade:** Alta

---

### RNF-MANT-002: Testabilidade

**Descrição:** O sistema deve ser facilmente testável.

**Especificações:**
- Cobertura de testes unitários mínima de 80%
- Testes de integração para funcionalidades críticas
- Testes end-to-end para fluxos principais
- Testes automatizados devem fazer parte do pipeline de CI/CD

**Prioridade:** Alta

---

### RNF-MANT-003: Versionamento

**Descrição:** O código deve estar sob controle de versão.

**Especificações:**
- Uso de sistema de controle de versão (Git)
- Commits devem ser descritivos
- Branching strategy definida (Git Flow ou similar)
- Tags de versão para releases

**Prioridade:** Alta

---

## 8. Requisitos de Portabilidade

### RNF-PORT-001: Deploy

**Descrição:** O sistema deve ser facilmente implantável em diferentes ambientes.

**Especificações:**
- Deploy automatizado
- Configuração através de variáveis de ambiente
- Suporte a ambientes: desenvolvimento, staging, produção
- Documentação de processo de deploy

**Prioridade:** Média

---

## 9. Requisitos de Confiabilidade

### RNF-CONF-001: Integridade de Dados

**Descrição:** O sistema deve garantir integridade dos dados.

**Especificações:**
- Transações de banco de dados devem ser atômicas
- Validação de dados em múltiplas camadas
- Backup automático e regular
- Sistema de logs para auditoria

**Prioridade:** Alta

---

### RNF-CONF-002: Tratamento de Erros

**Descrição:** O sistema deve tratar erros de forma adequada.

**Especificações:**
- Erros não devem expor informações sensíveis
- Logs de erro devem ser registrados para análise
- Usuário deve receber mensagens de erro amigáveis
- Sistema deve se recuperar de erros quando possível

**Prioridade:** Alta

---

## 10. Requisitos de Integração

### RNF-INT-001: APIs Externas

**Descrição:** O sistema deve integrar com serviços externos de forma confiável.

**Especificações:**
- Integração com gateway de pagamento
- Integração com APIs de cálculo de frete
- Integração com serviços de e-mail transacional
- Tratamento de falhas em integrações externas
- Retry logic para requisições falhadas

**Prioridade:** Alta

---

### RNF-INT-002: Disponibilidade de APIs Externas

**Descrição:** O sistema deve funcionar mesmo quando APIs externas estão indisponíveis.

**Especificações:**
- Fallback para quando APIs de frete estão indisponíveis
- Cache de dados quando apropriado
- Timeout adequado para requisições externas
- Notificações quando integrações falham

**Prioridade:** Média

---

## 11. Requisitos de Documentação

### RNF-DOC-001: Documentação Técnica

**Descrição:** O sistema deve ter documentação técnica completa.

**Especificações:**
- Documentação de arquitetura
- Documentação de API
- Documentação de banco de dados
- README com instruções de instalação e execução
- Comentários no código

**Prioridade:** Média

---

### RNF-DOC-002: Documentação de Usuário

**Descrição:** O sistema deve ter documentação para usuários finais.

**Especificações:**
- Manual do usuário
- Manual do administrador
- FAQ integrado
- Tutoriais e guias

**Prioridade:** Baixa

---

## 12. Requisitos de Monitoramento

### RNF-MON-001: Logging

**Descrição:** O sistema deve registrar logs adequados.

**Especificações:**
- Logs de erros e exceções
- Logs de transações importantes
- Logs de auditoria para ações administrativas
- Níveis de log apropriados (DEBUG, INFO, WARN, ERROR)
- Retenção de logs por período definido

**Prioridade:** Média

---

### RNF-MON-002: Métricas

**Descrição:** O sistema deve coletar métricas de performance e uso.

**Especificações:**
- Métricas de performance (tempo de resposta, throughput)
- Métricas de uso (número de usuários, transações)
- Alertas para métricas críticas
- Dashboard de monitoramento

**Prioridade:** Média

---

## 13. Requisitos Legais e Regulatórios

### RNF-LEG-001: LGPD

**Descrição:** O sistema deve estar em conformidade com a LGPD.

**Especificações:**
- Consentimento explícito para coleta de dados
- Direito ao esquecimento (exclusão de dados)
- Portabilidade de dados
- Política de privacidade clara
- Proteção de dados pessoais

**Prioridade:** Alta

---

### RNF-LEG-002: Notas Fiscais

**Descrição:** O sistema deve gerar notas fiscais conforme legislação.

**Especificações:**
- Integração com sistema de emissão de NF-e
- Conformidade com legislação fiscal vigente
- Armazenamento de documentos fiscais

**Prioridade:** Alta

---

## 14. Requisitos de Capacidade

### RNF-CAP-001: Armazenamento

**Descrição:** O sistema deve suportar crescimento de dados.

**Especificações:**
- Banco de dados deve suportar pelo menos 100.000 produtos
- Suportar pelo menos 1.000.000 de pedidos
- Suportar pelo menos 500.000 usuários
- Armazenamento de imagens otimizado

**Prioridade:** Média

---

## 15. Matriz de Prioridades

| Categoria | Prioridade Geral | Observações |
|-----------|------------------|-------------|
| Performance | Alta | Crítico para experiência do usuário |
| Disponibilidade | Alta | E-commerce precisa estar sempre disponível |
| Segurança | Alta | Crítico para proteção de dados e pagamentos |
| Usabilidade | Alta | Impacta diretamente na conversão |
| Compatibilidade | Alta | Necessário para alcançar todos os usuários |
| Manutenibilidade | Alta | Facilita evolução do sistema |
| Confiabilidade | Alta | Garante integridade dos dados |
| Integração | Alta | Dependências críticas |
| Monitoramento | Média | Importante para operação |
| Documentação | Média | Facilita manutenção |
| Legal | Alta | Conformidade obrigatória |
| Capacidade | Média | Planejamento para crescimento |

---

## 16. Métricas de Sucesso

### 16.1 Performance
- 95% das páginas carregam em menos de 2 segundos
- 99% das requisições são processadas em menos de 3 segundos

### 16.2 Disponibilidade
- Uptime de 99,5% ou superior
- MTTR de menos de 1 hora

### 16.3 Segurança
- Zero incidentes de segurança críticos
- 100% das senhas criptografadas
- 100% das comunicações via HTTPS

### 16.4 Usabilidade
- Taxa de conclusão de checkout acima de 70%
- Tempo médio para completar compra menor que 5 minutos

---

## 17. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Validar requisitos não funcionais com stakeholders
- Definir métricas específicas de monitoramento
- Estabelecer SLAs (Service Level Agreements)


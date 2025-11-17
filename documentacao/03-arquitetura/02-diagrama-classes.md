# Diagrama de Classes
## Soto Café - E-commerce de Cafeteria Gourmet

**Versão:** 1.0  
**Data:** 2024  
**Autor:** Tiago Soares Carneiro da Cunha  
**RGM:** 44030509

---

## 1. Introdução

Este documento apresenta o diagrama de classes do sistema Soto Café, descrevendo as principais classes, seus atributos, métodos e relacionamentos.

---

## 2. Classes Principais

### 2.1 Módulo de Usuários

#### Classe: Usuario
```java
class Usuario {
    - Long id
    - String nome
    - String email
    - String senhaHash
    - String telefone
    - String cpf
    - Enum tipoUsuario
    - Enum status
    - Date dataCadastro
    - Date dataUltimoAcesso
    - Boolean emailVerificado
    
    + criar()
    + atualizar()
    + autenticar()
    + desativar()
    + verificarEmail()
}
```

#### Classe: Endereco
```java
class Endereco {
    - Long id
    - Long usuarioId
    - Enum tipoEndereco
    - String cep
    - String rua
    - String numero
    - String complemento
    - String bairro
    - String cidade
    - String estado
    - Boolean enderecoPrincipal
    
    + criar()
    + atualizar()
    + deletar()
    + marcarComoPrincipal()
}
```

**Relacionamento:** Usuario 1..* Endereco

---

### 2.2 Módulo de Produtos

#### Classe: Produto
```java
class Produto {
    - Long id
    - Long categoriaId
    - String nome
    - String descricao
    - String sku
    - BigDecimal precoUnitario
    - Integer estoqueAtual
    - Integer estoqueMinimo
    - Double pesoGramas
    - Boolean ativo
    - Boolean destaque
    
    + criar()
    + atualizar()
    + deletar()
    + verificarEstoque()
    + atualizarEstoque()
}
```

#### Classe: Categoria
```java
class Categoria {
    - Long id
    - String nome
    - String descricao
    - String slug
    - Long categoriaPaiId
    - Integer ordemExibicao
    - Boolean ativo
    
    + criar()
    + atualizar()
    + deletar()
    + listarProdutos()
}
```

**Relacionamento:** Categoria 1..* Produto

---

### 2.3 Módulo de Pedidos

#### Classe: Pedido
```java
class Pedido {
    - Long id
    - Long clienteId
    - Long enderecoEntregaId
    - String numeroPedido
    - Date dataPedido
    - Enum statusPedido
    - BigDecimal valorSubtotal
    - BigDecimal valorDesconto
    - BigDecimal valorFrete
    - BigDecimal valorTotal
    - Enum metodoPagamento
    - Enum statusPagamento
    - String codigoRastreamento
    
    + criar()
    + atualizarStatus()
    + cancelar()
    + calcularTotal()
    + gerarNumeroPedido()
}
```

#### Classe: ItemPedido
```java
class ItemPedido {
    - Long id
    - Long pedidoId
    - Long produtoId
    - Integer quantidade
    - BigDecimal precoUnitario
    - BigDecimal subtotal
    
    + criar()
    + calcularSubtotal()
}
```

**Relacionamento:** Pedido 1..* ItemPedido  
**Relacionamento:** ItemPedido *..1 Produto

---

### 2.4 Módulo de Carrinho

#### Classe: Carrinho
```java
class Carrinho {
    - Long id
    - Long usuarioId
    - String sessionId
    - Date dataCriacao
    - Date dataExpiracao
    
    + criar()
    + adicionarItem()
    + removerItem()
    + atualizarQuantidade()
    + limpar()
    + calcularTotal()
}
```

#### Classe: ItemCarrinho
```java
class ItemCarrinho {
    - Long id
    - Long carrinhoId
    - Long produtoId
    - Integer quantidade
    
    + criar()
    + atualizarQuantidade()
    + remover()
}
```

**Relacionamento:** Carrinho 1..* ItemCarrinho

---

### 2.5 Módulo de Cupons

#### Classe: CupomDesconto
```java
class CupomDesconto {
    - Long id
    - String codigo
    - Enum tipoDesconto
    - BigDecimal valorDesconto
    - Date dataInicio
    - Date dataFim
    - Integer limiteUsosTotal
    - Integer limiteUsosPorCliente
    - Integer usosAtuais
    - BigDecimal valorMinimoPedido
    - Boolean ativo
    
    + criar()
    + validar()
    + aplicar()
    + incrementarUso()
    + verificarDisponibilidade()
}
```

**Relacionamento:** CupomDesconto 1..* Pedido

---

### 2.6 Módulo de Fidelidade

#### Classe: ProgramaFidelidade
```java
class ProgramaFidelidade {
    - Long id
    - Long usuarioId
    - Integer saldoPontos
    - Integer pontosTotaisGanhos
    - Integer pontosTotaisResgatados
    - Date dataUltimaAtualizacao
    
    + adicionarPontos()
    + resgatarPontos()
    + calcularPontos()
    + verificarSaldo()
}
```

#### Classe: HistoricoPontos
```java
class HistoricoPontos {
    - Long id
    - Long fidelidadeId
    - Long pedidoId
    - Enum tipoMovimentacao
    - Integer pontos
    - String descricao
    - Date dataMovimentacao
    
    + registrar()
}
```

**Relacionamento:** ProgramaFidelidade 1..* HistoricoPontos

---

### 2.7 Módulo de Assinatura

#### Classe: Assinatura
```java
class Assinatura {
    - Long id
    - Long usuarioId
    - Long planoId
    - Enum frequenciaEntrega
    - Enum status
    - Date dataInicio
    - Date dataProximaEntrega
    - Date dataCancelamento
    - BigDecimal valorMensal
    
    + criar()
    + pausar()
    + cancelar()
    + reativar()
    + gerarPedido()
}
```

#### Classe: PlanoAssinatura
```java
class PlanoAssinatura {
    - Long id
    - String nome
    - String descricao
    - BigDecimal valorMensal
    - Integer quantidadeCafe
    - Boolean ativo
    
    + criar()
    + atualizar()
    + desativar()
}
```

**Relacionamento:** PlanoAssinatura 1..* Assinatura

---

## 3. Diagrama de Classes Simplificado

```
┌─────────────┐         ┌──────────────┐
│   Usuario   │────────<│  Endereco    │
└──────┬──────┘   1..*  └──────────────┘
       │
       │ 1
       │
       │ *         ┌──────────────┐
       └──────────>│    Pedido    │
                   └──────┬───────┘
                          │
                          │ 1
                          │
                          │ *         ┌──────────────┐
                          └──────────>│  ItemPedido  │
                                      └──────┬───────┘
                                             │
                                             │ *..1
                                             │
                                      ┌──────▼───────┐
                                      │   Produto    │
                                      └──────┬───────┘
                                             │
                                             │ *..1
                                             │
                                      ┌──────▼───────┐
                                      │  Categoria   │
                                      └──────────────┘

┌─────────────┐         ┌──────────────┐
│  Carrinho   │────────<│ ItemCarrinho │
└─────────────┘   1..*  └──────┬───────┘
                               │
                               │ *..1
                               │
                          ┌────▼───────┐
                          │  Produto   │
                          └────────────┘

┌─────────────┐         ┌──────────────┐
│   Pedido    │────────<│ CupomDesconto│
└─────────────┘   *..1  └──────────────┘

┌─────────────┐         ┌──────────────┐
│   Usuario   │────────<│ProgramaFideli│
└─────────────┘   1..1  └──────┬───────┘
                               │
                               │ 1
                               │
                               │ *         ┌──────────────┐
                               └──────────>│HistoricoPonto│
                                           └──────────────┘
```

---

## 4. Classes de Serviço

### 4.1 Serviços de Negócio

#### Classe: PedidoService
```java
class PedidoService {
    + criarPedido(Carrinho, Endereco, MetodoPagamento): Pedido
    + processarPagamento(Pedido): Boolean
    + atualizarStatus(Pedido, Status): void
    + cancelarPedido(Pedido): void
    + calcularFrete(Carrinho, CEP): BigDecimal
}
```

#### Classe: EstoqueService
```java
class EstoqueService {
    + verificarDisponibilidade(Produto, Integer): Boolean
    + reservarEstoque(Produto, Integer): void
    + baixarEstoque(Produto, Integer): void
    + reverterEstoque(Produto, Integer): void
    + verificarEstoqueMinimo(Produto): Boolean
}
```

#### Classe: FidelidadeService
```java
class FidelidadeService {
    + acumularPontos(Usuario, Pedido): void
    + resgatarPontos(Usuario, Integer): BigDecimal
    + calcularPontos(BigDecimal): Integer
    + verificarValidadePontos(Usuario): void
}
```

---

## 5. Classes de Repositório

### 5.1 Padrão Repository

#### Interface: IUsuarioRepository
```java
interface IUsuarioRepository {
    + findById(Long): Usuario
    + findByEmail(String): Usuario
    + save(Usuario): Usuario
    + delete(Long): void
    + findAll(): List<Usuario>
}
```

#### Interface: IProdutoRepository
```java
interface IProdutoRepository {
    + findById(Long): Produto
    + findByCategoria(Long): List<Produto>
    + search(String): List<Produto>
    + save(Produto): Produto
    + delete(Long): void
}
```

---

## 6. Classes de Validação

### 6.1 Validadores

#### Classe: ValidadorPedido
```java
class ValidadorPedido {
    + validarCarrinho(Carrinho): Boolean
    + validarEstoque(ItemPedido): Boolean
    + validarEndereco(Endereco): Boolean
    + validarPagamento(MetodoPagamento): Boolean
}
```

#### Classe: ValidadorCupom
```java
class ValidadorCupom {
    + validarCodigo(String): Boolean
    + validarValidade(CupomDesconto): Boolean
    + validarLimiteUso(CupomDesconto): Boolean
    + validarValorMinimo(CupomDesconto, BigDecimal): Boolean
}
```

---

## 7. Notações UML

### 7.1 Relacionamentos

- **Associação (1..1)**: Um para um
- **Associação (1..*)**: Um para muitos
- **Associação (*..1)**: Muitos para um
- **Associação (*..*)**: Muitos para muitos
- **Herança**: Extends/Implements
- **Composição**: Parte-todo forte
- **Agregação**: Parte-todo fraco

### 7.2 Visibilidade

- **+**: Público (public)
- **-**: Privado (private)
- **#**: Protegido (protected)
- **~**: Pacote (package)

---

## 8. Aprovações

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Tiago Soares Carneiro da Cunha | Desenvolvedor/Responsável | ___________ | ___/___/___ |

---

**Próximos Passos:**
- Criar diagrama visual completo
- Detalhar métodos e parâmetros
- Validar relacionamentos
- Implementar classes no código


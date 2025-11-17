import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Typography, Button, Card, CardContent, Grid, IconButton, TextField, Alert } from '@mui/material'
import { Delete, ShoppingCart, CheckCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Carrinho = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')
  const [cupomCodigo, setCupomCodigo] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState<any>(null)
  const [cupomErro, setCupomErro] = useState('')

  // Hooks devem ser chamados sempre na mesma ordem (regra dos hooks do React)
  const { data: carrinho, error: carrinhoError } = useQuery({
    queryKey: ['carrinho'],
    queryFn: async () => {
      try {
        const response = await api.get('/carrinho')
        return response.data.data
      } catch (error: any) {
        console.error('Erro ao buscar carrinho:', error)
        throw error
      }
    },
    enabled: !!token, // Só executa se tiver token
    retry: 1,
    refetchOnWindowFocus: false, // Evitar refetch desnecessário
    staleTime: 10000, // Cache por 10 segundos
  })

  const removerItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/carrinho/itens/${id}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidar apenas a query do carrinho, não outras queries
      queryClient.invalidateQueries({ queryKey: ['carrinho'], exact: true })
    },
    onError: (error: any) => {
      console.error('Erro ao remover item:', error)
      alert(error.response?.data?.message || 'Erro ao remover item do carrinho')
    },
  })

  const validarCupomMutation = useMutation({
    mutationFn: async (codigo: string) => {
      const response = await api.get(`/cupons/validar/${codigo}`)
      return response.data.data
    },
    onSuccess: (data) => {
      setCupomAplicado(data)
      setCupomErro('')
    },
    onError: (error: any) => {
      setCupomErro(error.response?.data?.message || 'Cupom inválido')
      setCupomAplicado(null)
    }
  })

  const handleAplicarCupom = () => {
    if (!cupomCodigo.trim()) {
      setCupomErro('Digite um código de cupom')
      return
    }
    validarCupomMutation.mutate(cupomCodigo.trim().toUpperCase())
  }

  const handleRemoverCupom = () => {
    setCupomAplicado(null)
    setCupomCodigo('')
    setCupomErro('')
  }

  const calcularSubtotal = () => {
    if (!carrinho?.itens) return 0
    return carrinho.itens.reduce((total: number, item: any) => {
      return total + Number(item.preco_unitario) * item.quantidade
    }, 0)
  }

  const calcularDesconto = () => {
    if (!cupomAplicado) return 0
    const subtotal = calcularSubtotal()
    
    // Verificar valor mínimo
    if (cupomAplicado.valor_minimo_pedido && subtotal < cupomAplicado.valor_minimo_pedido) {
      return 0
    }

    if (cupomAplicado.tipo_desconto === 'Percentual') {
      return (subtotal * cupomAplicado.valor_desconto) / 100
    } else {
      return Math.min(cupomAplicado.valor_desconto, subtotal)
    }
  }

  const calcularTotal = () => {
    return calcularSubtotal() - calcularDesconto()
  }

  // Verificações condicionais após todos os hooks
  if (!token) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Faça login para ver seu carrinho
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Fazer Login
        </Button>
      </Box>
    )
  }

  if (carrinhoError) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Erro ao carregar carrinho
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {carrinhoError instanceof Error ? carrinhoError.message : 'Erro desconhecido'}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </Box>
    )
  }

  if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Seu carrinho está vazio
        </Typography>
        <Button variant="contained" onClick={() => navigate('/produtos')} sx={{ mt: 2 }}>
          Ver Produtos
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Carrinho de Compras
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {carrinho.itens.map((item: any) => (
            <Card key={item.id_item_carrinho} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.imagem || '/placeholder.jpg'}
                      alt={item.nome_produto}
                      style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">{item.nome_produto}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      R$ {Number(item.preco_unitario).toFixed(2)} cada
                    </Typography>
                    <Typography variant="body1">
                      Quantidade: {item.quantidade}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6">
                      R$ {(Number(item.preco_unitario) * item.quantidade).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => removerItemMutation.mutate(item.id_item_carrinho)}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>
              
              {/* Campo de Cupom */}
              <Box sx={{ mb: 2 }}>
                {cupomAplicado ? (
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle />}
                    action={
                      <Button size="small" onClick={handleRemoverCupom}>
                        Remover
                      </Button>
                    }
                    sx={{ mb: 1 }}
                  >
                    Cupom {cupomAplicado.codigo_cupom} aplicado!
                    {cupomAplicado.tipo_desconto === 'Percentual' 
                      ? ` ${cupomAplicado.valor_desconto}% OFF`
                      : ` R$ ${cupomAplicado.valor_desconto.toFixed(2)} OFF`}
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Código do cupom"
                      value={cupomCodigo}
                      onChange={(e) => {
                        setCupomCodigo(e.target.value.toUpperCase())
                        setCupomErro('')
                      }}
                      error={!!cupomErro}
                      helperText={cupomErro}
                      fullWidth
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAplicarCupom()
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAplicarCupom}
                      disabled={validarCupomMutation.isPending}
                    >
                      Aplicar
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>R$ {calcularSubtotal().toFixed(2)}</Typography>
              </Box>
              
              {cupomAplicado && calcularDesconto() > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="success.main">Desconto:</Typography>
                  <Typography color="success.main">
                    - R$ {calcularDesconto().toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Frete:</Typography>
                <Typography>Calculado no checkout</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">R$ {calcularTotal().toFixed(2)}</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                onClick={() => navigate('/checkout', { state: { cupomAplicado } })}
              >
                Finalizar Compra
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Carrinho


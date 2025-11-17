import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Typography, Button, Card, CardContent, Grid, IconButton } from '@mui/material'
import { Delete, ShoppingCart } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Carrinho = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')

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
  })

  const removerItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/carrinho/itens/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carrinho'] })
    },
    onError: (error: any) => {
      console.error('Erro ao remover item:', error)
      alert(error.response?.data?.message || 'Erro ao remover item do carrinho')
    },
  })

  const calcularTotal = () => {
    if (!carrinho?.itens) return 0
    return carrinho.itens.reduce((total: number, item: any) => {
      return total + Number(item.preco_unitario) * item.quantidade
    }, 0)
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Subtotal:</Typography>
                <Typography>R$ {calcularTotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Frete:</Typography>
                <Typography>Calculado no checkout</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">R$ {calcularTotal().toFixed(2)}</Typography>
              </Box>
              <Button variant="contained" fullWidth size="large">
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


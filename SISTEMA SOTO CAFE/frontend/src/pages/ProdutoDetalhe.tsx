import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Typography, Button, TextField, Grid, Card, CardMedia, Alert } from '@mui/material'
import { useState } from 'react'
import api from '../services/api'

const ProdutoDetalhe = () => {
  const { slug } = useParams()
  const [quantidade, setQuantidade] = useState(1)
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')

  const { data: produto } = useQuery({
    queryKey: ['produto', slug],
    queryFn: async () => {
      const response = await api.get(`/produtos/${slug}`)
      return response.data.data
    },
  })

  const adicionarCarrinhoMutation = useMutation({
    mutationFn: async (data: { id_produto: number; quantidade: number }) => {
      const response = await api.post('/carrinho/itens', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carrinho'] })
      alert('Produto adicionado ao carrinho!')
    },
  })

  const handleAdicionarCarrinho = () => {
    if (!token) {
      alert('Faça login para adicionar produtos ao carrinho')
      return
    }
    adicionarCarrinhoMutation.mutate({
      id_produto: produto.id_produto,
      quantidade,
    })
  }

  if (!produto) {
    return <Typography>Carregando...</Typography>
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardMedia
            component="img"
            height="500"
            image={
              produto.imagens && Array.isArray(produto.imagens) && produto.imagens.length > 0
                ? produto.imagens[0]?.url_imagem || produto.imagem_principal
                : produto.imagem_principal || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'
            }
            alt={produto.nome_produto}
            sx={{ objectFit: 'cover' }}
          />
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom>
          {produto.nome_produto}
        </Typography>
        <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
          R$ {Number(produto.preco_unitario).toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {produto.descricao}
        </Typography>
        {produto.estoque_atual > 0 ? (
          <Box sx={{ mt: 3 }}>
            <TextField
              type="number"
              label="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              inputProps={{ min: 1, max: produto.estoque_atual }}
              sx={{ mr: 2, width: 120 }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleAdicionarCarrinho}
              disabled={adicionarCarrinhoMutation.isPending}
            >
              Adicionar ao Carrinho
            </Button>
          </Box>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Produto fora de estoque
          </Alert>
        )}
      </Grid>
    </Grid>
  )
}

export default ProdutoDetalhe


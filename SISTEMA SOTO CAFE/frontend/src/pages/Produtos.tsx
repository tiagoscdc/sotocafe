import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Grid, Card, CardContent, CardMedia, Typography, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Produtos = () => {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const response = await api.get('/categorias')
      return response.data.data
    },
  })

  const { data: produtosData } = useQuery({
    queryKey: ['produtos', busca, categoria],
    queryFn: async () => {
      const params: any = { limit: 20 }
      if (busca) params.busca = busca
      if (categoria) params.categoria = categoria
      const response = await api.get('/produtos', { params })
      return response.data
    },
  })

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Nossos Produtos
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Buscar produtos"
          variant="outlined"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            label="Categoria"
          >
            <MenuItem value="">Todas</MenuItem>
            {categorias && categorias.length > 0 ? categorias.map((cat: any) => (
              <MenuItem key={cat.id_categoria || cat.slug || Math.random()} value={cat.slug}>
                {cat.nome_categoria}
              </MenuItem>
            )) : null}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {produtosData?.data && produtosData.data.length > 0 ? produtosData.data.map((produto: any) => (
          <Grid item xs={12} sm={6} md={4} key={produto.id_produto || produto.slug || Math.random()}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={produto.imagem_principal || '/placeholder.jpg'}
                alt={produto.nome_produto}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {produto.nome_produto}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {produto.descricao_curta}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  R$ {Number(produto.preco_unitario).toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/produtos/${produto.slug}`)}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Nenhum produto encontrado.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default Produtos


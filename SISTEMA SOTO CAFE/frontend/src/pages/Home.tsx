import { useQuery } from '@tanstack/react-query'
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Home = () => {
  const navigate = useNavigate()

  const { data: produtos } = useQuery({
    queryKey: ['produtos', 'destaque'],
    queryFn: async () => {
      const response = await api.get('/produtos?destaque=true&limit=6')
      return response.data.data
    },
  })

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao Soto Café
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Descubra os melhores cafés gourmet do Brasil
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Produtos em Destaque
      </Typography>

      <Grid container spacing={3}>
        {produtos && produtos.length > 0 ? produtos.map((produto: any) => (
          <Grid item xs={12} sm={6} md={4} key={produto.id_produto || produto.slug}>
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
              Nenhum produto em destaque no momento.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default Home


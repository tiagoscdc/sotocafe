import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Card, CardContent, Grid, Chip, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Visibility } from '@mui/icons-material'
import api from '../services/api'

const Pedidos = () => {
  const navigate = useNavigate()
  const { data: pedidos, error, isLoading } = useQuery<any[]>({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const response = await api.get('/pedidos')
      return response.data.data || []
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // Cache por 30 segundos
    gcTime: 300000, // Manter em cache por 5 minutos (cacheTime foi renomeado para gcTime)
  })

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">Carregando pedidos...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Erro ao carregar pedidos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Typography>
      </Box>
    )
  }

  if (!pedidos || pedidos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">Você ainda não fez nenhum pedido</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Meus Pedidos
      </Typography>

      {pedidos.map((pedido: any) => (
        <Card key={pedido.id_pedido} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Pedido #{pedido.numero_pedido}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                </Typography>
                {pedido.itens && pedido.itens.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Chip
                  label={pedido.status_pedido}
                  color={pedido.status_pedido === 'Entregue' ? 'success' : 'primary'}
                  sx={{ mb: 1, display: 'block', width: 'fit-content', ml: { xs: 0, sm: 'auto' } }}
                />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Total: R$ {Number(pedido.valor_total).toFixed(2)}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => navigate(`/pedidos/${pedido.id_pedido}`)}
                  size="small"
                  sx={{ display: 'block', ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
                >
                  Ver Detalhes
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default Pedidos


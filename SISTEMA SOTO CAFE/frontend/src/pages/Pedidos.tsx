import { useQuery } from '@tanstack/react-query'
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material'
import api from '../services/api'

const Pedidos = () => {
  const { data: pedidos } = useQuery({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const response = await api.get('/pedidos')
      return response.data.data
    },
  })

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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Pedido #{pedido.numero_pedido}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Chip
                  label={pedido.status_pedido}
                  color={pedido.status_pedido === 'Entregue' ? 'success' : 'primary'}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6">Total: R$ {Number(pedido.valor_total).toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default Pedidos


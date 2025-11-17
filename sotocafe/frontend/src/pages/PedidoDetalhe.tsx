import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import api from '../services/api'

const PedidoDetalhe = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: pedido, error, isLoading } = useQuery({
    queryKey: ['pedido', id],
    queryFn: async () => {
      const response = await api.get(`/pedidos/${id}`)
      return response.data.data
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">Carregando detalhes do pedido...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Erro ao carregar pedido
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/pedidos')}>
          Voltar para Pedidos
        </Button>
      </Box>
    )
  }

  if (!pedido) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5">Pedido não encontrado</Typography>
        <Button variant="contained" onClick={() => navigate('/pedidos')} sx={{ mt: 2 }}>
          Voltar para Pedidos
        </Button>
      </Box>
    )
  }

  const formatarMetodoPagamento = (metodo: string) => {
    const metodos: { [key: string]: string } = {
      'Pix': 'PIX',
      'Boleto': 'Boleto Bancário',
      'Cartao_Credito': 'Cartão de Crédito'
    }
    return metodos[metodo] || metodo
  }

  const formatarStatusPagamento = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: 'success' | 'warning' | 'error' | 'default' } } = {
      'Pendente': { label: 'Pendente', color: 'warning' },
      'Aprovado': { label: 'Aprovado', color: 'success' },
      'Recusado': { label: 'Recusado', color: 'error' },
      'Estornado': { label: 'Estornado', color: 'error' }
    }
    return statusMap[status] || { label: status, color: 'default' }
  }

  const statusPagamento = formatarStatusPagamento(pedido.status_pagamento)

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/pedidos')}
        sx={{ mb: 2 }}
      >
        Voltar para Pedidos
      </Button>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Detalhes do Pedido #{pedido.numero_pedido}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Itens do Pedido
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Preço Unitário</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedido.itens && pedido.itens.length > 0 ? (
                      pedido.itens.map((item: any) => (
                        <TableRow key={item.id_item}>
                          <TableCell>
                            <Typography variant="body1">{item.produto?.nome || 'Produto'}</Typography>
                          </TableCell>
                          <TableCell align="right">{item.quantidade}</TableCell>
                          <TableCell align="right">
                            R$ {Number(item.preco_unitario).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            R$ {Number(item.subtotal).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Nenhum item encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Endereço de Entrega
              </Typography>
              
              {pedido.endereco ? (
                <Box>
                  <Typography variant="body1">
                    {pedido.endereco.rua}, {pedido.endereco.numero}
                    {pedido.endereco.complemento && ` - ${pedido.endereco.complemento}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pedido.endereco.bairro} - {pedido.endereco.cidade}/{pedido.endereco.estado}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CEP: {pedido.endereco.cep}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Endereço não disponível
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações do Pedido
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Número do Pedido
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {pedido.numero_pedido}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Data do Pedido
                </Typography>
                <Typography variant="body1">
                  {new Date(pedido.data_pedido).toLocaleString('pt-BR')}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status do Pedido
                </Typography>
                <Chip
                  label={pedido.status_pedido}
                  color={pedido.status_pedido === 'Entregue' ? 'success' : 'primary'}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Método de Pagamento
                </Typography>
                <Typography variant="body1">
                  {formatarMetodoPagamento(pedido.metodo_pagamento)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status do Pagamento
                </Typography>
                <Chip
                  label={statusPagamento.label}
                  color={statusPagamento.color}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              {pedido.codigo_rastreamento && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Código de Rastreamento
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {pedido.codigo_rastreamento}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo Financeiro
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>R$ {Number(pedido.valor_subtotal).toFixed(2)}</Typography>
              </Box>

              {pedido.valor_desconto > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="success.main">Desconto:</Typography>
                  <Typography color="success.main">
                    - R$ {Number(pedido.valor_desconto).toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Frete:</Typography>
                <Typography>R$ {Number(pedido.valor_frete).toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">R$ {Number(pedido.valor_total).toFixed(2)}</Typography>
              </Box>

              {pedido.cupom && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Cupom Aplicado: {pedido.cupom.codigo_cupom}
                  </Typography>
                  <Typography variant="body2">
                    {pedido.cupom.tipo_desconto === 'Percentual'
                      ? `Desconto de ${pedido.cupom.valor_desconto}%`
                      : `Desconto de R$ ${Number(pedido.cupom.valor_desconto).toFixed(2)}`}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PedidoDetalhe


import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Alert
} from '@mui/material'
import { CreditCard, QrCode, Receipt } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [metodoPagamento, setMetodoPagamento] = useState('Pix')
  const cupomAplicado = location.state?.cupomAplicado || null

  const { data: carrinho } = useQuery({
    queryKey: ['carrinho'],
    queryFn: async () => {
      const response = await api.get('/carrinho')
      return response.data.data
    },
    enabled: !!token
  })

  const { data: enderecos } = useQuery({
    queryKey: ['enderecos'],
    queryFn: async () => {
      const response = await api.get('/usuarios/enderecos')
      return response.data.data || []
    },
    enabled: !!token
  })

  if (!token) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Faça login para finalizar a compra
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
          Fazer Login
        </Button>
      </Box>
    )
  }

  if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Seu carrinho está vazio
        </Typography>
        <Button variant="contained" onClick={() => navigate('/carrinho')} sx={{ mt: 2 }}>
          Voltar ao Carrinho
        </Button>
      </Box>
    )
  }

  const enderecoPrincipal = enderecos?.find((e: any) => e.endereco_principal === 1) || enderecos?.[0]

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
    return calcularSubtotal() - calcularDesconto() // Frete será calculado depois
  }

  const handleFinalizar = () => {
    if (!enderecoPrincipal) {
      alert('Você precisa cadastrar um endereço antes de finalizar a compra. Acesse seu perfil para adicionar um endereço.')
      navigate('/perfil')
      return
    }

    if (metodoPagamento === 'Pix') {
      navigate('/pagamento/pix', { state: { carrinho, endereco: enderecoPrincipal, total: calcularTotal(), cupomAplicado } })
    } else if (metodoPagamento === 'Boleto') {
      navigate('/pagamento/boleto', { state: { carrinho, endereco: enderecoPrincipal, total: calcularTotal(), cupomAplicado } })
    } else {
      alert('Método de pagamento ainda não implementado')
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Finalizar Compra
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Endereço de Entrega
              </Typography>
              {enderecoPrincipal ? (
                <Box>
                  <Typography variant="body1">
                    {enderecoPrincipal.rua}, {enderecoPrincipal.numero}
                    {enderecoPrincipal.complemento && ` - ${enderecoPrincipal.complemento}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {enderecoPrincipal.bairro} - {enderecoPrincipal.cidade}/{enderecoPrincipal.estado}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CEP: {enderecoPrincipal.cep}
                  </Typography>
                  <Button size="small" onClick={() => navigate('/perfil')} sx={{ mt: 1 }}>
                    Alterar Endereço
                  </Button>
                </Box>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Você precisa cadastrar um endereço antes de finalizar a compra.
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Método de Pagamento
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                >
                  <FormControlLabel
                    value="Pix"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <QrCode />
                        <Typography>PIX - Pagamento instantâneo</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="Boleto"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Receipt />
                        <Typography>Boleto Bancário</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="Cartao_Credito"
                    control={<Radio />}
                    disabled
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCard />
                        <Typography>Cartão de Crédito (Em breve)</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>
              
              {carrinho.itens.map((item: any) => (
                <Box key={item.id_item_carrinho} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.nome_produto} x {item.quantidade}
                  </Typography>
                  <Typography variant="body2">
                    R$ {(Number(item.preco_unitario) * item.quantidade).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {cupomAplicado && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Cupom {cupomAplicado.codigo_cupom} aplicado!
                  {cupomAplicado.tipo_desconto === 'Percentual' 
                    ? ` ${cupomAplicado.valor_desconto}% OFF`
                    : ` R$ ${cupomAplicado.valor_desconto.toFixed(2)} OFF`}
                </Alert>
              )}

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
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Frete:</Typography>
                <Typography>Calculado no pagamento</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">R$ {calcularTotal().toFixed(2)}</Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleFinalizar}
                disabled={!enderecoPrincipal}
              >
                Continuar para Pagamento
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Checkout


import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material'
import { CheckCircle, ContentCopy } from '@mui/icons-material'
import api from '../services/api'

const PagamentoPix = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { carrinho, endereco, total, cupomAplicado, frete } = location.state || {}
  const [qrCode, setQrCode] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const criarPedidoMutation = useMutation({
    mutationFn: async () => {
      if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
        throw new Error('Carrinho vazio')
      }
      
      if (!endereco || !endereco.id_endereco) {
        throw new Error('Endereço não selecionado')
      }

      const itens = carrinho.itens.map((item: any) => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade
      }))

      const response = await api.post('/pedidos', {
        itens,
        id_endereco_entrega: endereco.id_endereco,
        metodo_pagamento: 'Pix',
        valor_frete: frete || 0,
        id_cupom: cupomAplicado?.id_cupom || null
      })
      return response.data
    },
    onSuccess: async (data) => {
      // Limpar cache ANTES de qualquer operação assíncrona
      queryClient.removeQueries({ queryKey: ['carrinho'] })
      queryClient.setQueryData(['carrinho'], null)
      
      try {
        // Limpar carrinho no backend
        try {
          // Limpar carrinho completo no backend
          await api.delete('/carrinho').catch(() => {
            // Ignorar erros, apenas tentar limpar
          })
        } catch (e) {
          // Ignorar erros de limpeza
        }
        
        // Invalidar pedidos ANTES de navegar
        queryClient.invalidateQueries({ queryKey: ['pedidos'], exact: true })
        
        // Mostrar mensagem
        const numeroPedido = data?.data?.numero_pedido || 'N/A'
        alert(`Pedido criado com sucesso! Número: ${numeroPedido}`)
        
        // Navegar imediatamente - não fazer mais nada após isso
        navigate('/pedidos', { replace: true })
      } catch (error) {
        console.error('Erro no onSuccess:', error)
        const numeroPedido = data?.data?.numero_pedido || 'N/A'
        alert(`Pedido criado com sucesso! Número: ${numeroPedido}`)
        navigate('/pedidos', { replace: true })
      }
    },
    onError: (error: any) => {
      console.error('Erro ao criar pedido:', error)
      console.error('Error response:', error.response)
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar pedido'
      alert(errorMessage)
    }
  })

  useEffect(() => {
    if (!carrinho || !endereco || !total) {
      console.warn('⚠️ Dados faltando para pagamento:', {
        carrinho: !!carrinho,
        endereco: !!endereco,
        total: !!total
      })
      navigate('/carrinho')
      return
    }

    // Simular geração de QR Code PIX
    // Em produção, isso viria de uma API de pagamento real
    setLoading(true)
    timeoutRef.current = setTimeout(() => {
      // Gerar código PIX simulado
      const codigoPix = `00020126580014BR.GOV.BCB.PIX0136${Date.now()}520400005303986540${Number(total).toFixed(2)}5802BR5925SOTO CAFE LTDA6009SAO PAULO62070503***6304`
      setPixCode(codigoPix)
      setQrCode(`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QSVggUVIgQ29kZTwvdGV4dD48L3N2Zz4=`)
      setLoading(false)
    }, 2000)
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [carrinho, endereco, total, navigate])

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmarPagamento = () => {
    // Criar pedido sem validação de pagamento (sistema acadêmico)
    criarPedidoMutation.mutate()
  }

  if (!carrinho || !endereco) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Dados não encontrados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Por favor, volte ao carrinho e tente novamente.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/carrinho')}>
          Voltar ao Carrinho
        </Button>
      </Box>
    )
  }
  
  if (!carrinho.itens || carrinho.itens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Carrinho vazio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/produtos')}>
          Ver Produtos
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Pagamento via PIX
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Escaneie o QR Code
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <img src={qrCode} alt="QR Code PIX" style={{ maxWidth: '100%', height: 'auto' }} />
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Ou copie o código PIX:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    p: 1,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  {pixCode || 'Gerando código...'}
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyPixCode}
                  disabled={!pixCode}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                O pagamento será confirmado automaticamente após a confirmação do banco.
                Normalmente leva alguns segundos.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Endereço de Entrega:
                </Typography>
                <Typography variant="body1">
                  {endereco.rua}, {endereco.numero}
                  {endereco.complemento && ` - ${endereco.complemento}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CEP: {endereco.cep}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>R$ {(total - (frete || 0)).toFixed(2)}</Typography>
              </Box>

              {frete > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Frete:</Typography>
                  <Typography>R$ {frete.toFixed(2)}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">R$ {total.toFixed(2)}</Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CheckCircle />}
                onClick={handleConfirmarPagamento}
                disabled={loading || criarPedidoMutation.isPending}
              >
                {criarPedidoMutation.isPending ? 'Finalizando Pedido...' : 'Finalizar Pedido'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => navigate('/carrinho')}
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PagamentoPix


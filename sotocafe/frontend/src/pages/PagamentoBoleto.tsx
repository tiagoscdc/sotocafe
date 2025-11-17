import { useState, useEffect } from 'react'
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
import { CheckCircle, Download, ContentCopy } from '@mui/icons-material'
import api from '../services/api'

const PagamentoBoleto = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { carrinho, endereco, total, cupomAplicado } = location.state || {}
  const [codigoBarras, setCodigoBarras] = useState('')
  const [linhaDigitavel, setLinhaDigitavel] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const criarPedidoMutation = useMutation({
    mutationFn: async () => {
      const itens = carrinho.itens.map((item: any) => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade
      }))

      const response = await api.post('/pedidos', {
        itens,
        id_endereco_entrega: endereco.id_endereco,
        metodo_pagamento: 'Boleto',
        valor_frete: 0, // Frete será calculado depois
        id_cupom: cupomAplicado?.id_cupom || null
      })
      return response.data
    },
    onSuccess: async (data) => {
      // Limpar carrinho após criar pedido
      try {
        await api.delete('/carrinho')
        queryClient.invalidateQueries({ queryKey: ['carrinho'] })
      } catch (e) {
        console.warn('Erro ao limpar carrinho:', e)
      }
      
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      alert(`Pedido criado com sucesso! Número: ${data.data.numero_pedido}`)
      navigate('/pedidos')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erro ao criar pedido')
    }
  })

  useEffect(() => {
    if (!carrinho || !endereco) {
      navigate('/carrinho')
      return
    }

    // Simular geração de boleto
    // Em produção, isso viria de uma API de pagamento real
    setLoading(true)
    setTimeout(() => {
      // Gerar dados do boleto simulados
      const vencimentoDate = new Date()
      vencimentoDate.setDate(vencimentoDate.getDate() + 3) // 3 dias para vencimento
      setVencimento(vencimentoDate.toLocaleDateString('pt-BR'))
      
      // Código de barras simulado (formato padrão brasileiro)
      const codigo = `34191.${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} ${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}.${Math.floor(Math.random() * 100000).toString().padStart(5, '0')} ${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}.${Math.floor(Math.random() * 100000).toString().padStart(6, '0')} ${Math.floor(Math.random() * 100000).toString().padStart(5, '0')} ${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`
      setLinhaDigitavel(codigo)
      
      // Código de barras numérico
      setCodigoBarras(codigo.replace(/\s/g, '').replace(/\./g, ''))
      setLoading(false)
    }, 2000)
  }, [carrinho, endereco, total, navigate])

  const handleCopyLinhaDigitavel = () => {
    navigator.clipboard.writeText(linhaDigitavel)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadBoleto = () => {
    // Em produção, isso baixaria o PDF do boleto
    alert('Em produção, isso baixaria o PDF do boleto.')
  }

  const handleConfirmarPagamento = () => {
    // Criar pedido sem validação de pagamento (sistema acadêmico)
    criarPedidoMutation.mutate()
  }

  if (!carrinho || !endereco) {
    return null
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Pagamento via Boleto
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dados do Boleto
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Vencimento:
                    </Typography>
                    <Typography variant="h6" color="error">
                      {vencimento}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Linha Digitável:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box
                        sx={{
                          flex: 1,
                          p: 1.5,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          letterSpacing: 1
                        }}
                      >
                        {linhaDigitavel || 'Gerando boleto...'}
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopy />}
                        onClick={handleCopyLinhaDigitavel}
                        disabled={!linhaDigitavel}
                      >
                        {copied ? 'Copiado!' : 'Copiar'}
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Código de Barras:
                    </Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {codigoBarras || 'Gerando código...'}
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download />}
                    onClick={handleDownloadBoleto}
                    disabled={!linhaDigitavel}
                    sx={{ mb: 2 }}
                  >
                    Baixar Boleto (PDF)
                  </Button>

                  <Alert severity="info">
                    O boleto vence em 3 dias. Após o pagamento, o pedido será confirmado automaticamente.
                  </Alert>
                </Box>
              )}
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

export default PagamentoBoleto


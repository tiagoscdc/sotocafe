import { useState } from 'react'
import { Box, Button, Typography, Alert, CircularProgress, Paper, Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

const PopularBanco = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Verificar status atual do banco
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['seed-status'],
    queryFn: async () => {
      const response = await api.get('/seed/status')
      return response.data.data
    },
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  })

  const handlePopular = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await api.post('/seed/populate')
      if (response.data.success) {
        setSuccess(true)
        refetchStatus() // Atualizar status
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao popular banco'
      const instrucoes = err.response?.data?.instrucoes || []
      setError(errorMsg + (instrucoes.length > 0 ? '\n\n' + instrucoes.join('\n') : ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <Typography variant="h4" gutterBottom>
        Popular Banco de Dados
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Clique no botão abaixo para popular o banco com dados de exemplo
      </Typography>

      {/* Status atual do banco */}
      {status && (
        <Paper sx={{ p: 3, mb: 2, width: '100%', maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Status Atual do Banco
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Usuários:</Typography>
              <Typography variant="h6">{status.usuarios || 0}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Produtos:</Typography>
              <Typography variant="h6">{status.produtos || 0}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Categorias:</Typography>
              <Typography variant="h6">{status.categorias || 0}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Cupons:</Typography>
              <Typography variant="h6">{status.cupons || 0}</Typography>
            </Grid>
          </Grid>
          {status.produtos > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Banco já possui dados! Você pode popular novamente para limpar e recriar.
            </Alert>
          )}
        </Paper>
      )}

      {success && (
        <Alert severity="success" sx={{ width: '100%', maxWidth: 500 }}>
          Banco populado com sucesso! Redirecionando...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 700, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Erro ao popular banco</Typography>
          <Typography variant="body2" paragraph>{error}</Typography>
          {error.includes('conectar') && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Instruções para resolver:</Typography>
              <Typography variant="body2" component="div">
                1. Certifique-se de que o PostgreSQL está instalado e rodando<br />
                2. Crie o banco de dados:<br />
                &nbsp;&nbsp;&nbsp;<code>createdb -U postgres soto_cafe</code><br />
                3. Execute o schema SQL:<br />
                &nbsp;&nbsp;&nbsp;<code>psql -U postgres -d soto_cafe -f database/schema.sql</code><br />
                4. Tente novamente clicando no botão acima
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      <Button
        variant="contained"
        size="large"
        onClick={handlePopular}
        disabled={loading || success}
        sx={{ minWidth: 200 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Popular Banco'}
      </Button>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>
          Credenciais após popular:
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> joao@email.com<br />
          <strong>Senha:</strong> 123456
        </Typography>
      </Box>
    </Box>
  )
}

export default PopularBanco


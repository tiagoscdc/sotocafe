import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material'
import { Edit, Delete, Add, CheckCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Endereco {
  id_endereco: number
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  tipo_endereco: string
  endereco_principal: number
}

const Perfil = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null)
  const [formData, setFormData] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    tipo_endereco: 'Residencial',
    endereco_principal: false
  })

  const { data: enderecos, isLoading } = useQuery({
    queryKey: ['enderecos'],
    queryFn: async () => {
      const response = await api.get('/usuarios/enderecos')
      return response.data.data
    },
    enabled: !!token
  })

  const adicionarEnderecoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/usuarios/enderecos', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos'] })
      setDialogOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erro ao adicionar endereço')
    }
  })

  const editarEnderecoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/usuarios/enderecos/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos'] })
      setDialogOpen(false)
      setEditingEndereco(null)
      resetForm()
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erro ao editar endereço')
    }
  })

  const removerEnderecoMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/usuarios/enderecos/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enderecos'] })
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Erro ao remover endereço')
    }
  })

  const resetForm = () => {
    setFormData({
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      tipo_endereco: 'Residencial',
      endereco_principal: false
    })
    setEditingEndereco(null)
  }

  const handleOpenDialog = (endereco?: Endereco) => {
    if (endereco) {
      setEditingEndereco(endereco)
      setFormData({
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero,
        complemento: endereco.complemento || '',
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        tipo_endereco: endereco.tipo_endereco,
        endereco_principal: endereco.endereco_principal === 1
      })
    } else {
      resetForm()
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingEndereco(null)
    resetForm()
  }

  const handleSubmit = () => {
    if (!formData.cep || !formData.rua || !formData.numero || !formData.bairro || !formData.cidade || !formData.estado) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (editingEndereco) {
      editarEnderecoMutation.mutate({
        id: editingEndereco.id_endereco,
        data: formData
      })
    } else {
      adicionarEnderecoMutation.mutate(formData)
    }
  }

  const handleRemover = (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este endereço?')) {
      removerEnderecoMutation.mutate(id)
    }
  }

  if (!token) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Faça login para acessar seu perfil
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
          Fazer Login
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Meu Perfil
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informações Pessoais
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body1">{user?.nome || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Tipo de Usuário
              </Typography>
              <Typography variant="body1">{user?.tipoUsuario || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Meus Endereços
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Adicionar Endereço
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : !enderecos || enderecos.length === 0 ? (
            <Alert severity="info">
              Você ainda não possui endereços cadastrados. Adicione um endereço para facilitar suas compras.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {enderecos.map((endereco: Endereco) => (
                <Grid item xs={12} md={6} key={endereco.id_endereco}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          {endereco.endereco_principal === 1 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckCircle color="primary" sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="caption" color="primary" fontWeight="bold">
                                Endereço Principal
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="subtitle2" color="text.secondary">
                            {endereco.tipo_endereco}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(endereco)}
                            color="primary"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleRemover(endereco.id_endereco)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body1">
                        {endereco.rua}, {endereco.numero}
                        {endereco.complemento && ` - ${endereco.complemento}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {endereco.bairro}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {endereco.cidade} - {endereco.estado}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        CEP: {endereco.cep}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEndereco ? 'Editar Endereço' : 'Adicionar Endereço'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CEP *"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Endereço</InputLabel>
                <Select
                  value={formData.tipo_endereco}
                  onChange={(e) => setFormData({ ...formData, tipo_endereco: e.target.value })}
                  label="Tipo de Endereço"
                >
                  <MenuItem value="Residencial">Residencial</MenuItem>
                  <MenuItem value="Comercial">Comercial</MenuItem>
                  <MenuItem value="Cobranca">Cobrança</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rua *"
                value={formData.rua}
                onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número *"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Complemento"
                value={formData.complemento}
                onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bairro *"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Cidade *"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estado *"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                inputProps={{ maxLength: 2 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.endereco_principal}
                    onChange={(e) => setFormData({ ...formData, endereco_principal: e.target.checked })}
                  />
                }
                label="Definir como endereço principal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={adicionarEnderecoMutation.isPending || editarEnderecoMutation.isPending}
          >
            {editingEndereco ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Perfil


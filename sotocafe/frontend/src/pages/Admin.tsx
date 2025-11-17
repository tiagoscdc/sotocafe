import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material'
import { Edit, Delete, Add, CheckCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const Admin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const isAdmin = user?.tipoUsuario === 'Admin' || user?.tipoUsuario === 'Administrador'

  const [tabValue, setTabValue] = useState(0)
  const [produtoDialogOpen, setProdutoDialogOpen] = useState(false)
  const [cupomDialogOpen, setCupomDialogOpen] = useState(false)
  const [editingProduto, setEditingProduto] = useState<any>(null)
  const [editingCupom, setEditingCupom] = useState<any>(null)

  // Verificar se é admin
  if (!token || !isAdmin) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Acesso Negado
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Você não tem permissão para acessar esta página.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Voltar para Home
        </Button>
      </Box>
    )
  }

  // Queries
  const { data: produtos } = useQuery({
    queryKey: ['admin-produtos'],
    queryFn: async () => {
      const response = await api.get('/produtos?limit=1000')
      return response.data.data || []
    }
  })

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const response = await api.get('/categorias')
      return response.data.data || []
    }
  })

  const { data: cupons } = useQuery({
    queryKey: ['admin-cupons'],
    queryFn: async () => {
      const response = await api.get('/cupons')
      return response.data.data || []
    }
  })

  // Mutations para Produtos
  const criarProdutoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/produtos', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produtos'] })
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      setProdutoDialogOpen(false)
      resetProdutoForm()
    }
  })

  const editarProdutoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/produtos/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produtos'] })
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
      setProdutoDialogOpen(false)
      setEditingProduto(null)
      resetProdutoForm()
    }
  })

  const removerProdutoMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/produtos/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produtos'] })
      queryClient.invalidateQueries({ queryKey: ['produtos'] })
    }
  })

  // Mutations para Cupons
  const criarCupomMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/cupons', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cupons'] })
      setCupomDialogOpen(false)
      resetCupomForm()
    }
  })

  const editarCupomMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/cupons/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cupons'] })
      setCupomDialogOpen(false)
      setEditingCupom(null)
      resetCupomForm()
    }
  })

  const removerCupomMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/cupons/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cupons'] })
    }
  })

  // Form states
  const [produtoForm, setProdutoForm] = useState({
    nome_produto: '',
    descricao: '',
    descricao_curta: '',
    slug: '',
    sku: '',
    preco_unitario: '',
    id_categoria: '',
    estoque_atual: '',
    peso_gramas: '',
    ativo: true,
    destaque: false
  })

  const [cupomForm, setCupomForm] = useState({
    codigo_cupom: '',
    tipo_desconto: 'Percentual',
    valor_desconto: '',
    data_inicio: '',
    data_fim: '',
    limite_usos_total: '',
    limite_usos_por_cliente: '',
    valor_minimo_pedido: '',
    ativo: true
  })

  const resetProdutoForm = () => {
    setProdutoForm({
      nome_produto: '',
      descricao: '',
      descricao_curta: '',
      slug: '',
      sku: '',
      preco_unitario: '',
      id_categoria: '',
      estoque_atual: '',
      peso_gramas: '',
      ativo: true,
      destaque: false
    })
    setEditingProduto(null)
  }

  const resetCupomForm = () => {
    setCupomForm({
      codigo_cupom: '',
      tipo_desconto: 'Percentual',
      valor_desconto: '',
      data_inicio: '',
      data_fim: '',
      limite_usos_total: '',
      limite_usos_por_cliente: '',
      valor_minimo_pedido: '',
      ativo: true
    })
    setEditingCupom(null)
  }

  const handleOpenProdutoDialog = (produto?: any) => {
    if (produto) {
      setEditingProduto(produto)
      setProdutoForm({
        nome_produto: produto.nome_produto || '',
        descricao: produto.descricao || '',
        descricao_curta: produto.descricao_curta || '',
        slug: produto.slug || '',
        sku: produto.sku || '',
        preco_unitario: produto.preco_unitario || '',
        id_categoria: produto.id_categoria || '',
        estoque_atual: produto.estoque_atual || '',
        peso_gramas: produto.peso_gramas || '',
        ativo: produto.ativo === 1 || produto.ativo === true,
        destaque: produto.destaque === 1 || produto.destaque === true
      })
    } else {
      resetProdutoForm()
    }
    setProdutoDialogOpen(true)
  }

  const handleOpenCupomDialog = (cupom?: any) => {
    if (cupom) {
      setEditingCupom(cupom)
      setCupomForm({
        codigo_cupom: cupom.codigo_cupom || '',
        tipo_desconto: cupom.tipo_desconto || 'Percentual',
        valor_desconto: cupom.valor_desconto || '',
        data_inicio: cupom.data_inicio || '',
        data_fim: cupom.data_fim || '',
        limite_usos_total: cupom.limite_usos_total || '',
        limite_usos_por_cliente: cupom.limite_usos_por_cliente || '',
        valor_minimo_pedido: cupom.valor_minimo_pedido || '',
        ativo: cupom.ativo === 1 || cupom.ativo === true
      })
    } else {
      resetCupomForm()
    }
    setCupomDialogOpen(true)
  }

  const handleSubmitProduto = () => {
    if (!produtoForm.nome_produto || !produtoForm.slug || !produtoForm.sku || !produtoForm.preco_unitario || !produtoForm.id_categoria) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const data = {
      ...produtoForm,
      preco_unitario: parseFloat(produtoForm.preco_unitario),
      id_categoria: parseInt(produtoForm.id_categoria),
      estoque_atual: parseInt(produtoForm.estoque_atual) || 0,
      peso_gramas: parseFloat(produtoForm.peso_gramas) || 0
    }

    if (editingProduto) {
      editarProdutoMutation.mutate({ id: editingProduto.id_produto, data })
    } else {
      criarProdutoMutation.mutate(data)
    }
  }

  const handleSubmitCupom = () => {
    if (!cupomForm.codigo_cupom || !cupomForm.valor_desconto || !cupomForm.data_inicio || !cupomForm.data_fim) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const data = {
      ...cupomForm,
      valor_desconto: parseFloat(cupomForm.valor_desconto),
      limite_usos_total: cupomForm.limite_usos_total ? parseInt(cupomForm.limite_usos_total) : null,
      limite_usos_por_cliente: cupomForm.limite_usos_por_cliente ? parseInt(cupomForm.limite_usos_por_cliente) : null,
      valor_minimo_pedido: parseFloat(cupomForm.valor_minimo_pedido) || 0
    }

    if (editingCupom) {
      editarCupomMutation.mutate({ id: editingCupom.id_cupom, data })
    } else {
      criarCupomMutation.mutate(data)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Painel Administrativo
      </Typography>

      <Card>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Produtos" />
          <Tab label="Cupons" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Gerenciar Produtos</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenProdutoDialog()}>
              Adicionar Produto
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Estoque</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos && produtos.length > 0 ? (
                  produtos.map((produto: any) => (
                    <TableRow key={produto.id_produto}>
                      <TableCell>{produto.id_produto}</TableCell>
                      <TableCell>{produto.nome_produto}</TableCell>
                      <TableCell>{produto.sku}</TableCell>
                      <TableCell>R$ {Number(produto.preco_unitario).toFixed(2)}</TableCell>
                      <TableCell>{produto.estoque_atual}</TableCell>
                      <TableCell>{produto.ativo === 1 ? 'Ativo' : 'Inativo'}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleOpenProdutoDialog(produto)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => {
                          if (window.confirm('Tem certeza que deseja remover este produto?')) {
                            removerProdutoMutation.mutate(produto.id_produto)
                          }
                        }}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Nenhum produto cadastrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Gerenciar Cupons</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenCupomDialog()}>
              Adicionar Cupom
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Válido até</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cupons && cupons.length > 0 ? (
                  cupons.map((cupom: any) => (
                    <TableRow key={cupom.id_cupom}>
                      <TableCell>{cupom.id_cupom}</TableCell>
                      <TableCell>{cupom.codigo_cupom}</TableCell>
                      <TableCell>{cupom.tipo_desconto}</TableCell>
                      <TableCell>
                        {cupom.tipo_desconto === 'Percentual' 
                          ? `${cupom.valor_desconto}%`
                          : `R$ ${Number(cupom.valor_desconto).toFixed(2)}`}
                      </TableCell>
                      <TableCell>{new Date(cupom.data_fim).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{cupom.ativo === 1 ? 'Ativo' : 'Inativo'}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleOpenCupomDialog(cupom)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => {
                          if (window.confirm('Tem certeza que deseja desativar este cupom?')) {
                            removerCupomMutation.mutate(cupom.id_cupom)
                          }
                        }}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Nenhum cupom cadastrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Dialog Produto */}
      <Dialog open={produtoDialogOpen} onClose={() => setProdutoDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduto ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nome do Produto *" fullWidth value={produtoForm.nome_produto} onChange={(e) => setProdutoForm({ ...produtoForm, nome_produto: e.target.value })} />
            <TextField label="Slug *" fullWidth value={produtoForm.slug} onChange={(e) => setProdutoForm({ ...produtoForm, slug: e.target.value })} />
            <TextField label="SKU *" fullWidth value={produtoForm.sku} onChange={(e) => setProdutoForm({ ...produtoForm, sku: e.target.value })} />
            <TextField label="Preço Unitário *" type="number" fullWidth value={produtoForm.preco_unitario} onChange={(e) => setProdutoForm({ ...produtoForm, preco_unitario: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Categoria *</InputLabel>
              <Select value={produtoForm.id_categoria} onChange={(e) => setProdutoForm({ ...produtoForm, id_categoria: e.target.value })}>
                {categorias?.map((cat: any) => (
                  <MenuItem key={cat.id_categoria} value={cat.id_categoria}>{cat.nome_categoria}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Descrição Curta" fullWidth multiline rows={2} value={produtoForm.descricao_curta} onChange={(e) => setProdutoForm({ ...produtoForm, descricao_curta: e.target.value })} />
            <TextField label="Descrição" fullWidth multiline rows={4} value={produtoForm.descricao} onChange={(e) => setProdutoForm({ ...produtoForm, descricao: e.target.value })} />
            <TextField label="Estoque" type="number" fullWidth value={produtoForm.estoque_atual} onChange={(e) => setProdutoForm({ ...produtoForm, estoque_atual: e.target.value })} />
            <TextField label="Peso (gramas)" type="number" fullWidth value={produtoForm.peso_gramas} onChange={(e) => setProdutoForm({ ...produtoForm, peso_gramas: e.target.value })} />
            <FormControlLabel control={<Switch checked={produtoForm.ativo} onChange={(e) => setProdutoForm({ ...produtoForm, ativo: e.target.checked })} />} label="Ativo" />
            <FormControlLabel control={<Switch checked={produtoForm.destaque} onChange={(e) => setProdutoForm({ ...produtoForm, destaque: e.target.checked })} />} label="Destaque" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProdutoDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmitProduto} variant="contained" disabled={criarProdutoMutation.isPending || editarProdutoMutation.isPending}>
            {editingProduto ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Cupom */}
      <Dialog open={cupomDialogOpen} onClose={() => setCupomDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingCupom ? 'Editar Cupom' : 'Adicionar Cupom'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Código do Cupom *" fullWidth value={cupomForm.codigo_cupom} onChange={(e) => setCupomForm({ ...cupomForm, codigo_cupom: e.target.value.toUpperCase() })} />
            <FormControl fullWidth>
              <InputLabel>Tipo de Desconto *</InputLabel>
              <Select value={cupomForm.tipo_desconto} onChange={(e) => setCupomForm({ ...cupomForm, tipo_desconto: e.target.value })}>
                <MenuItem value="Percentual">Percentual (%)</MenuItem>
                <MenuItem value="Valor_Fixo">Valor Fixo (R$)</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Valor do Desconto *" type="number" fullWidth value={cupomForm.valor_desconto} onChange={(e) => setCupomForm({ ...cupomForm, valor_desconto: e.target.value })} />
            <TextField label="Data Início *" type="date" fullWidth InputLabelProps={{ shrink: true }} value={cupomForm.data_inicio} onChange={(e) => setCupomForm({ ...cupomForm, data_inicio: e.target.value })} />
            <TextField label="Data Fim *" type="date" fullWidth InputLabelProps={{ shrink: true }} value={cupomForm.data_fim} onChange={(e) => setCupomForm({ ...cupomForm, data_fim: e.target.value })} />
            <TextField label="Limite de Usos Total" type="number" fullWidth value={cupomForm.limite_usos_total} onChange={(e) => setCupomForm({ ...cupomForm, limite_usos_total: e.target.value })} />
            <TextField label="Limite de Usos por Cliente" type="number" fullWidth value={cupomForm.limite_usos_por_cliente} onChange={(e) => setCupomForm({ ...cupomForm, limite_usos_por_cliente: e.target.value })} />
            <TextField label="Valor Mínimo do Pedido" type="number" fullWidth value={cupomForm.valor_minimo_pedido} onChange={(e) => setCupomForm({ ...cupomForm, valor_minimo_pedido: e.target.value })} />
            <FormControlLabel control={<Switch checked={cupomForm.ativo} onChange={(e) => setCupomForm({ ...cupomForm, ativo: e.target.checked })} />} label="Ativo" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCupomDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmitCupom} variant="contained" disabled={criarCupomMutation.isPending || editarCupomMutation.isPending}>
            {editingCupom ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Admin


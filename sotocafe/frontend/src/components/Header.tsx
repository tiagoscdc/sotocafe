import { AppBar, Toolbar, Typography, Button, Badge, Box } from '@mui/material'
import { ShoppingCart, Person } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

const Header = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const isAdmin = user?.tipoUsuario === 'Admin' || user?.tipoUsuario === 'Administrador'

  const { data: carrinho } = useQuery({
    queryKey: ['carrinho'],
    queryFn: async () => {
      const response = await api.get('/carrinho')
      return response.data.data
    },
    enabled: !!token,
  })

  const quantidadeItens = carrinho?.itens?.reduce((acc: number, item: any) => acc + item.quantidade, 0) || 0

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#6F4E37' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          ☕ Soto Café
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/produtos">
            Produtos
          </Button>
          {token ? (
            <>
              {isAdmin && (
                <Button color="inherit" component={Link} to="/admin">
                  Painel Admin
                </Button>
              )}
              <Button color="inherit" component={Link} to="/pedidos">
                Meus Pedidos
              </Button>
              <Button color="inherit" startIcon={<Person />}>
                {user?.nome || 'Perfil'}
                {isAdmin && ' (Admin)'}
              </Button>
              {!isAdmin && (
                <Button color="inherit" component={Link} to="/carrinho" startIcon={
                  <Badge badgeContent={quantidadeItens} color="secondary">
                    <ShoppingCart />
                  </Badge>
                }>
                  Carrinho
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Entrar
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Cadastrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header


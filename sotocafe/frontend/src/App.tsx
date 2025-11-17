import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import Header from './components/Header'
import Home from './pages/Home'
import Produtos from './pages/Produtos'
import ProdutoDetalhe from './pages/ProdutoDetalhe'
import Carrinho from './pages/Carrinho'
import Login from './pages/Login'
import Register from './pages/Register'
import Pedidos from './pages/Pedidos'
import PopularBanco from './pages/PopularBanco'
import Perfil from './pages/Perfil'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:slug" element={<ProdutoDetalhe />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/popular-banco" element={<PopularBanco />} />
        </Routes>
      </Container>
      <Footer />
    </>
  )
}

export default App


import { Box, Container, Typography, Link as MuiLink } from '@mui/material'

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#6F4E37', color: 'white', py: 3, mt: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="body2" align="center">
          © 2025 Soto Café - E-commerce de Cafeteria Gourmet. Todos os direitos reservados.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Desenvolvido por Tiago Soares Carneiro da Cunha
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer


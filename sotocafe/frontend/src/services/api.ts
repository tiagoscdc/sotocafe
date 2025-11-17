import axios from 'axios'

// Detectar a URL da API automaticamente
const getApiUrl = () => {
  // Se VITE_API_URL estiver definida, usar ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Em produção (Vercel), usar a mesma origem + /api
  if (import.meta.env.PROD) {
    return `${window.location.origin}/api`
  }
  
  // Em desenvolvimento, usar localhost
  return 'http://localhost:3000/api'
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api


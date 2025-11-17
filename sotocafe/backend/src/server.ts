import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import sequelize from './config/database';

// Importar rotas
import authRoutes from './routes/auth.routes';
import produtoRoutes from './routes/produto.routes';
import categoriaRoutes from './routes/categoria.routes';
import pedidoRoutes from './routes/pedido.routes';
import carrinhoRoutes from './routes/carrinho.routes';
import usuarioRoutes from './routes/usuario.routes';
import seedRoutes from './routes/seed.routes';
import cupomRoutes from './routes/cupom.routes';

dotenv.config();

const app: Application = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// Middlewares gerais
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Soto Café API está funcionando!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/cupons', cupomRoutes);

// Middleware de erro
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rota 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Conectar ao banco e iniciar servidor
// No Vercel, não iniciamos o servidor HTTP (ele é serverless)
// Apenas em desenvolvimento local
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const startServer = async () => {
    const PORT = process.env.PORT || 3000;
    // Iniciar servidor mesmo se o banco não conectar (para permitir popular via API)
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n💡 Para popular o banco, acesse: http://localhost:${PORT}/api/seed/populate (POST)`);
      console.log(`   Ou acesse: http://localhost:5173/popular-banco\n`);
    });

    // Tentar conectar ao banco em background
    (async () => {
      try {
        await sequelize.authenticate();
        console.log('✅ Conexão com banco de dados estabelecida com sucesso.');
      } catch (error: any) {
        console.warn('⚠️ Aviso: Não foi possível conectar ao banco de dados:', error.message);
        console.warn('   O servidor continuará rodando. Você pode popular o banco via API.');
        console.warn('   Verifique se:');
        console.warn('   1. PostgreSQL está rodando');
        console.warn('   2. Banco "soto_cafe" foi criado');
        console.warn('   3. Credenciais no .env estão corretas\n');
      }
    })();
  };

  startServer();
}

export default app;


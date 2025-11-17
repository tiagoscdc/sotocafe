import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Registro
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Verificar se usuário já existe
    const [existingUsers]: any = await sequelize.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?',
      {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário (SQLite não tem RETURNING)
    await sequelize.query(
      `INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo_usuario, status, email_verificado)
       VALUES (?, ?, ?, ?, 'Cliente', 'Ativo', 0)`,
      {
        replacements: [nome, email, senhaHash, telefone || null],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Buscar usuário criado
    const [newUsers]: any = await sequelize.query(
      'SELECT id_usuario, nome, email, tipo_usuario FROM usuarios WHERE email = ?',
      {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Criar programa de fidelidade
    const userId = newUsers[0].id_usuario;
    await sequelize.query(
      'INSERT INTO programa_fidelidade (id_usuario) VALUES (?)',
      {
        replacements: [userId],
        type: sequelize.QueryTypes.INSERT
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: newUsers[0]
    });
  } catch (error: any) {
    console.error('Erro no registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const [users]: any = await sequelize.query(
      'SELECT id_usuario, nome, email, senha_hash, tipo_usuario, status FROM usuarios WHERE email = ?',
      {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    const user = users[0];
    
    // Debug: verificar estrutura do usuário
    console.log('Usuário encontrado:', {
      id: user.id_usuario,
      email: user.email,
      temSenhaHash: !!user.senha_hash,
      tipoUsuario: user.tipo_usuario,
      status: user.status
    });
    
    // Verificar se o usuário tem senha_hash
    if (!user.senha_hash) {
      console.error('Usuário sem senha_hash:', user.email);
      return res.status(500).json({
        success: false,
        message: 'Erro: usuário sem senha configurada'
      });
    }

    // Verificar senha
    let senhaValida = false;
    try {
      senhaValida = await bcrypt.compare(senha, user.senha_hash);
    } catch (bcryptError: any) {
      console.error('Erro ao comparar senha:', bcryptError.message);
      console.error('Hash recebido:', user.senha_hash?.substring(0, 20) + '...');
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar senha',
        error: process.env.NODE_ENV === 'development' ? bcryptError.message : undefined
      });
    }
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar status
    if (user.status !== 'Ativo') {
      return res.status(403).json({
        success: false,
        message: 'Conta inativa ou bloqueada'
      });
    }

    // Atualizar último acesso (não crítico se falhar)
    try {
      await sequelize.query(
        'UPDATE usuarios SET data_ultimo_acesso = CURRENT_TIMESTAMP WHERE id_usuario = ?',
        {
          replacements: [user.id_usuario],
          type: sequelize.QueryTypes.UPDATE
        }
      );
    } catch (updateError: any) {
      // Não bloquear o login se o update falhar (pode ser problema de permissão no Vercel)
      console.warn('⚠️ Erro ao atualizar último acesso (não crítico):', updateError.message);
    }

    // Gerar token JWT
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    if (!jwtSecret || jwtSecret === 'secret') {
      console.warn('⚠️ JWT_SECRET não configurado ou usando valor padrão inseguro');
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    let token: string;
    try {
      token = jwt.sign(
        {
          id: user.id_usuario,
          email: user.email,
          tipoUsuario: user.tipo_usuario
        },
        jwtSecret,
        { expiresIn } as jwt.SignOptions
      );
    } catch (jwtError: any) {
      console.error('Erro ao gerar token JWT:', jwtError.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao gerar token de autenticação',
        error: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
      });
    }

    return res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user.id_usuario,
          nome: user.nome,
          email: user.email,
          tipoUsuario: user.tipo_usuario
        }
      }
    });
  } catch (error: any) {
    console.error('Erro no login:', error);
    console.error('Stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
});

// Obter perfil do usuário autenticado
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [users]: any = await sequelize.query(
      `SELECT id_usuario, nome, email, telefone, tipo_usuario, status, data_cadastro
       FROM usuarios WHERE id_usuario = ?`,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    return res.json({
      success: true,
      data: users[0]
    });
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;


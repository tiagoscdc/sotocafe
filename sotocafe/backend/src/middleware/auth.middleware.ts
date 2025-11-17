import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    tipoUsuario: string;
  };
  body: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Token não fornecido' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'secret';
  
  jwt.verify(token, jwtSecret, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Token inválido' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      tipoUsuario: decoded.tipoUsuario
    };
    next();
  });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Não autenticado' });
      return;
    }

    if (!roles.includes(req.user.tipoUsuario)) {
      res.status(403).json({ success: false, message: 'Acesso negado' });
      return;
    }

    next();
  };
};


import type { Request, Response, NextFunction } from 'express';
import type { ITokenProvider } from '../../domain/adapters/ITokenProvider.js';

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

export class AuthMiddleware {
  constructor(private readonly tokenProvider: ITokenProvider) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ error: 'Token não fornecido.' });
        return;
      }

      const [scheme, token] = authHeader.split(' ');

      if (scheme !== 'Bearer') {
        res.status(401).json({ error: 'Formato de token inválido.' });
        return;
      }

      const decoded = await this.tokenProvider.verify(token);
      req.user = decoded;

      next();
    } catch (error: any) {
      res.status(401).json({ error: 'Token inválido ou expirado.' });
      return;
    }
  }
}

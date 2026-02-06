import type { Request, Response, NextFunction } from 'express';
import type { ITokenProvider } from '../../domain/adapters/ITokenProvider.js';
import type { ITokenBlacklistRepository } from '../../domain/repositories/ITokenBlacklistRepository.js';

export class AuthMiddleware {
  constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly blacklistRepository: ITokenBlacklistRepository
  ) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const isBlacklisted = await this.blacklistRepository.contains(token);
      if (isBlacklisted) {
        return res.status(401).json({ error: 'Token invalidated' });
      }
      const payload = await this.tokenProvider.verify(token);
      (req as any).user = payload;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
}

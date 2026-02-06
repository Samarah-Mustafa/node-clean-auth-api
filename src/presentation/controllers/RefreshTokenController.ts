import type { Request, Response } from 'express';
import type { RefreshTokenUseCase } from '../../use-cases/RefreshToken.js';

export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }
      const result = await this.refreshTokenUseCase.execute(refreshToken);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }
}
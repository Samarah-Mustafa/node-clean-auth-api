import type { Request, Response } from 'express';
import type { LogoutUserUseCase } from '../../use-cases/LogoutUser.js';

export class LogoutUserController {
  constructor(private readonly logoutUserUseCase: LogoutUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const [, token] = authHeader.split(' ');
        await this.logoutUserUseCase.execute(token);
      }
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
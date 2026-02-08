import type { Request, Response } from 'express';
import type { ConfirmEmailUseCase } from '../../use-cases/ConfirmEmail.js';

export class ConfirmEmailController {
  constructor(private readonly confirmEmailUseCase: ConfirmEmailUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }
      await this.confirmEmailUseCase.execute(token);
      return res.status(200).json({ message: 'E-mail confirmado com sucesso! Agora você pode fazer login.' });
    } catch (error: any) {
      return res.status(400).json({ error: 'Link de confirmação inválido ou expirado.' });
    }
  }
}
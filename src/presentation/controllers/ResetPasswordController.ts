import type { Request, Response } from 'express';
import type { ResetPasswordUseCase } from '../../use-cases/ResetPassword.js';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string(),
});

export class ResetPasswordController {
  constructor(private readonly resetPasswordUseCase: ResetPasswordUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      await this.resetPasswordUseCase.execute(token, password);
      return res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(400).json({ error: error.message || 'Erro ao redefinir senha.' });
    }
  }
}
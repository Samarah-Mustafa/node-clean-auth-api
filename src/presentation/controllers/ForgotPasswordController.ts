import type { Request, Response } from 'express';
import type { ForgotPasswordUseCase } from '../../use-cases/ForgotPassword.js';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export class ForgotPasswordController {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      await this.forgotPasswordUseCase.execute(email);
      return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação.' });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
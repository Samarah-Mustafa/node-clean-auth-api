import type { Request, Response } from 'express';
import type { ResendConfirmationEmailUseCase } from '../../use-cases/ResendConfirmationEmail.js';
import { z } from 'zod';

const resendConfirmationSchema = z.object({
  email: z.string().email(),
});

export class ResendConfirmationEmailController {
  constructor(private readonly resendConfirmationEmailUseCase: ResendConfirmationEmailUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = resendConfirmationSchema.parse(req.body);
      await this.resendConfirmationEmailUseCase.execute(email);
      return res.status(200).json({ message: 'E-mail de confirmação reenviado com sucesso.' });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
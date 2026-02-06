import type { Request, Response } from 'express';
import { LoginUserUseCase } from '../../use-cases/LoginUser.js';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Senha é requerida'),
});

export class LoginUserController {
  constructor(private readonly loginUseCase: LoginUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const result = await this.loginUseCase.execute(email, password);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(401).json({ error: error.message });
    }
  }
}

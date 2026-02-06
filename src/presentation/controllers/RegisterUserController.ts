// src/presentation/controllers/RegisterUserController.ts
import type { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../use-cases/RegisterUser.js';

export class RegisterUserController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      // Chama o caso de uso
      await this.registerUserUseCase.execute({ name, email, password });

      return res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error: any) {
      // Se for um erro do Zod ou de negócio, retornamos 400
      return res.status(400).json({ error: error.message });
    }
  }
}
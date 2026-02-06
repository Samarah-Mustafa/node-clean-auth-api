import type { Request, Response } from 'express';
import type { UpdateUserUseCase } from '../../use-cases/UpdateUser.js';

export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.id;
      const { name, email, password } = req.body;
      
      const data = { name, email, password };
      // Remove chaves undefined para não enviar lixo ao caso de uso
      Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key]);
      
      await this.updateUserUseCase.execute(userId, data);
      
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
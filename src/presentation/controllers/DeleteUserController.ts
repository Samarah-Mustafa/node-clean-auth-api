import type { Request, Response } from 'express';
import type { DeleteUserUseCase } from '../../use-cases/DeleteUser.js';

export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.id;
      await this.deleteUserUseCase.execute(userId);
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
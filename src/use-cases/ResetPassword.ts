import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { ITokenProvider } from '../domain/adapters/ITokenProvider.js';
import type { IEncrypter } from '../domain/adapters/IEncrypter.js';
import { passwordComplexitySchema } from '../domain/entities/User.js';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenProvider: ITokenProvider,
    private readonly encrypter: IEncrypter
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    // 1. Valida a complexidade da nova senha (reutilizando a regra da Entidade)
    passwordComplexitySchema.parse(newPassword);

    // 2. Verifica se o token é válido e extrai o ID do usuário
    const payload = await this.tokenProvider.verify(token);
    
    // 3. Criptografa a nova senha
    const hashedPassword = await this.encrypter.hash(newPassword);

    // 4. Atualiza a senha no repositório
    await this.userRepository.update(payload.id, { password: hashedPassword, isVerified: true });
  }
}
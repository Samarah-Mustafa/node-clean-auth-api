import type { IUserRepository } from '../domain/repositories/IUserRepository.js';
import type { ITokenProvider } from '../domain/adapters/ITokenProvider.js';
import type { IEmailService } from '../domain/adapters/IEmailService.js';
import type { IPasswordResetTokenRepository } from '../domain/repositories/IPasswordResetTokenRepository.js';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenProvider: ITokenProvider,
    private readonly emailService: IEmailService,
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    // Por segurança, se o usuário não existir, não retornamos erro para não vazar informações
    if (!user) {
      return;
    }

    // Gera um token válido por 1 hora
    const token = await this.tokenProvider.sign({ id: user.props.id, email: user.email }, '1h');

    await this.passwordResetTokenRepository.save(token, user.props.id);

    const resetLink = `http://localhost:3333/reset-password?token=${token}`;
    
    await this.emailService.sendMail(
      email,
      'Recuperação de Senha',
      `<p>Olá ${user.name},</p><p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir:</p><a href="${resetLink}">${resetLink}</a><p>Este link expira em 1 hora.</p>`
    );
  }
}
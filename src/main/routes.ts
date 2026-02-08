// src/main/routes.ts
import { Router } from 'express';
import { SqliteUserRepository } from '../infrastructure/repositories/SqliteUserRepository.js';
import { BcryptAdapter } from '../infrastructure/adapters/BcryptAdapter.js';
import { JwtAdapter } from '../infrastructure/adapters/JwtAdapter.js';
import { InMemoryTokenBlacklistRepository } from '../infrastructure/repositories/InMemoryTokenBlacklistRepository.js';
import { RegisterUserUseCase } from '../use-cases/RegisterUser.js';
import { LoginUserUseCase } from '../use-cases/LoginUser.js';
import { RefreshTokenUseCase } from '../use-cases/RefreshToken.js';
import { LogoutUserUseCase } from '../use-cases/LogoutUser.js';
import { UpdateUserUseCase } from '../use-cases/UpdateUser.js';
import { DeleteUserUseCase } from '../use-cases/DeleteUser.js';
import { ForgotPasswordUseCase } from '../use-cases/ForgotPassword.js';
import { ResetPasswordUseCase } from '../use-cases/ResetPassword.js';
import { ConfirmEmailUseCase } from '../use-cases/ConfirmEmail.js';
import { NodemailerAdapter } from '../infrastructure/adapters/NodemailerAdapter.js';
import { InMemoryPasswordResetTokenRepository } from '../infrastructure/repositories/InMemoryPasswordResetTokenRepository.js';
import { RegisterUserController } from '../presentation/controllers/RegisterUserController.js';
import { LoginUserController } from '../presentation/controllers/LoginUserController.js';
import { RefreshTokenController } from '../presentation/controllers/RefreshTokenController.js';
import { LogoutUserController } from '../presentation/controllers/LogoutUserController.js';
import { UpdateUserController } from '../presentation/controllers/UpdateUserController.js';
import { DeleteUserController } from '../presentation/controllers/DeleteUserController.js';
import { ForgotPasswordController } from '../presentation/controllers/ForgotPasswordController.js';
import { ResetPasswordController } from '../presentation/controllers/ResetPasswordController.js';
import { ConfirmEmailController } from '../presentation/controllers/ConfirmEmailController.js';
import { AuthMiddleware } from './middleware/AuthMiddleware.js';
import { authRateLimiter, apiRateLimiter } from './middleware/RateLimiterMiddleware.js';

const router = Router();

// Injeção de Dependências (Montando as peças do LEGO)
const userRepository = new SqliteUserRepository();
const encrypter = new BcryptAdapter(12); // Salt para bcrypt
const tokenProvider = new JwtAdapter(process.env.JWT_SECRET || 'seu-secret-seguro'); // Chave JWT
const tokenBlacklistRepository = new InMemoryTokenBlacklistRepository();
const emailService = new NodemailerAdapter();
const passwordResetTokenRepository = new InMemoryPasswordResetTokenRepository();

// Casos de Uso
const registerUserUseCase = new RegisterUserUseCase(userRepository, encrypter, emailService, tokenProvider);
const loginUserUseCase = new LoginUserUseCase(userRepository, encrypter, tokenProvider);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenProvider);
const logoutUserUseCase = new LogoutUserUseCase(tokenBlacklistRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository, encrypter);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, tokenProvider, emailService, passwordResetTokenRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, tokenProvider, encrypter);
const confirmEmailUseCase = new ConfirmEmailUseCase(userRepository, tokenProvider);

// Controllers
const registerUserController = new RegisterUserController(registerUserUseCase);
const loginUserController = new LoginUserController(loginUserUseCase);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);
const logoutUserController = new LogoutUserController(logoutUserUseCase);
const updateUserController = new UpdateUserController(updateUserUseCase);
const deleteUserController = new DeleteUserController(deleteUserUseCase);
const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase);
const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);
const confirmEmailController = new ConfirmEmailController(confirmEmailUseCase);

// Middlewares
const authMiddleware = new AuthMiddleware(tokenProvider, tokenBlacklistRepository);

// Aplica rate limit geral em todas as rotas (opcional, ou pode ser aplicado no server.ts)
// router.use(apiRateLimiter);

// Rota de Registro
router.post('/users', authRateLimiter, (req, res) => registerUserController.handle(req, res));

// Rota de Login
router.post('/login', authRateLimiter, (req, res) => loginUserController.handle(req, res));

// Rota de Refresh Token
router.post('/refresh-token', (req, res) => refreshTokenController.handle(req, res));

// Rota de Logout
router.post('/logout', (req, res) => logoutUserController.handle(req, res));

// Rota de Recuperação de Senha
router.post('/forgot-password', (req, res) => forgotPasswordController.handle(req, res));

// Rota de Redefinição de Senha (Troca efetiva)
router.post('/reset-password', (req, res) => resetPasswordController.handle(req, res));

// Rota de Confirmação de E-mail
router.get('/confirm-email', (req, res) => confirmEmailController.handle(req, res));

// Rota de Atualização de Perfil
router.patch('/me', 
  (req, res, next) => authMiddleware.handle(req, res, next),
  (req, res) => updateUserController.handle(req, res)
);

// Rota de Deletar Conta
router.delete('/me', 
  (req, res, next) => authMiddleware.handle(req, res, next),
  (req, res) => deleteUserController.handle(req, res)
);

// Rota Protegida - Exemplo
router.get('/me', 
  (req, res, next) => authMiddleware.handle(req, res, next),
  (req, res) => {
    return res.status(200).json({ 
      message: 'Dados do usuário autenticado', 
      user: req.user 
    });
  }
);

export { router };
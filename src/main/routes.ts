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
import { RegisterUserController } from '../presentation/controllers/RegisterUserController.js';
import { LoginUserController } from '../presentation/controllers/LoginUserController.js';
import { RefreshTokenController } from '../presentation/controllers/RefreshTokenController.js';
import { LogoutUserController } from '../presentation/controllers/LogoutUserController.js';
import { UpdateUserController } from '../presentation/controllers/UpdateUserController.js';
import { DeleteUserController } from '../presentation/controllers/DeleteUserController.js';
import { AuthMiddleware } from './middleware/AuthMiddleware.js';

const router = Router();

// Injeção de Dependências (Montando as peças do LEGO)
const userRepository = new SqliteUserRepository();
const encrypter = new BcryptAdapter(12); // Salt para bcrypt
const tokenProvider = new JwtAdapter(process.env.JWT_SECRET || 'seu-secret-seguro'); // Chave JWT
const tokenBlacklistRepository = new InMemoryTokenBlacklistRepository();

// Casos de Uso
const registerUserUseCase = new RegisterUserUseCase(userRepository, encrypter);
const loginUserUseCase = new LoginUserUseCase(userRepository, encrypter, tokenProvider);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenProvider);
const logoutUserUseCase = new LogoutUserUseCase(tokenBlacklistRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository, encrypter);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Controllers
const registerUserController = new RegisterUserController(registerUserUseCase);
const loginUserController = new LoginUserController(loginUserUseCase);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);
const logoutUserController = new LogoutUserController(logoutUserUseCase);
const updateUserController = new UpdateUserController(updateUserUseCase);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

// Middlewares
const authMiddleware = new AuthMiddleware(tokenProvider, tokenBlacklistRepository);

// Rota de Registro
router.post('/users', (req, res) => registerUserController.handle(req, res));

// Rota de Login
router.post('/login', (req, res) => loginUserController.handle(req, res));

// Rota de Refresh Token
router.post('/refresh-token', (req, res) => refreshTokenController.handle(req, res));

// Rota de Logout
router.post('/logout', (req, res) => logoutUserController.handle(req, res));

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
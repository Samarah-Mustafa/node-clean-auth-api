// src/main/routes.ts
import { Router } from 'express';
import { SqliteUserRepository } from '../infrastructure/repositories/SqliteUserRepository.js';
import { BcryptAdapter } from '../infrastructure/adapters/BcryptAdapter.js';
import { JwtAdapter } from '../infrastructure/adapters/JwtAdapter.js';
import { RegisterUserUseCase } from '../use-cases/RegisterUser.js';
import { LoginUserUseCase } from '../use-cases/LoginUser.js';
import { RegisterUserController } from '../presentation/controllers/RegisterUserController.js';
import { LoginUserController } from '../presentation/controllers/LoginUserController.js';
import { AuthMiddleware } from './middleware/AuthMiddleware.js';

const router = Router();

// Injeção de Dependências (Montando as peças do LEGO)
const userRepository = new SqliteUserRepository();
const encrypter = new BcryptAdapter(12); // Salt para bcrypt
const tokenProvider = new JwtAdapter(process.env.JWT_SECRET || 'seu-secret-seguro'); // Chave JWT

// Casos de Uso
const registerUserUseCase = new RegisterUserUseCase(userRepository, encrypter);
const loginUserUseCase = new LoginUserUseCase(userRepository, encrypter, tokenProvider);

// Controllers
const registerUserController = new RegisterUserController(registerUserUseCase);
const loginUserController = new LoginUserController(loginUserUseCase);

// Middlewares
const authMiddleware = new AuthMiddleware(tokenProvider);

// Rota de Registro
router.post('/users', (req, res) => registerUserController.handle(req, res));

// Rota de Login
router.post('/login', (req, res) => loginUserController.handle(req, res));

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
import rateLimit from 'express-rate-limit';

// Limitador geral para a API
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: { error: 'Muitas requisições, tente novamente mais tarde.' }
});

// Limitador mais estrito para rotas de autenticação (Login/Registro)
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Limite de 10 tentativas por hora
  message: { error: 'Muitas tentativas de login, tente novamente em uma hora.' }
});
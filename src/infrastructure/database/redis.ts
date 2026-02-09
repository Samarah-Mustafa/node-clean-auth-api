import Redis from 'ioredis';

// Em produção, use process.env.REDIS_URL
// Formato com senha: redis://:senha@host:porta
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Log de erro para ajudar a debugar problemas de conexão (ex: senha errada)
redis.on('error', (err) => {
  console.error('❌ Erro de conexão com Redis:', err);
});
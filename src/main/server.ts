import 'dotenv/config'; // Carrega as variáveis do .env automaticamente
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes'; // Importe aqui
const app = express();

// Middlewares de segurança e utilidades
app.use(helmet()); // Protege cabeçalhos HTTP
app.use(cors());   // Permite que o front-end acesse a API
app.use(express.json()); // Permite que a API entenda JSON no corpo (body) das requisições
app.use(router); // Use as rotas aqui

const PORT = process.env.PORT || 3333;

app.get('/health', (req, res) => {
  return res.json({ status: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
import nodemailer from 'nodemailer';
import type { IEmailService } from '../../domain/adapters/IEmailService.js';

export class NodemailerAdapter implements IEmailService {
  private transporter;

  constructor() {
    // Configuração básica. Em produção, use variáveis de ambiente (process.env.SMTP_HOST, etc)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
      },
    });
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    // Log para facilitar testes locais (mostra o link no terminal)
    console.log('\n--- 📧 EMAIL ENVIADO (SIMULAÇÃO) ---');
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Corpo: ${body}`);
    console.log('------------------------------------\n');

    try {
      await this.transporter.sendMail({
        from: '"App Auth" <noreply@app.com>',
        to,
        subject,
        html: body,
      });
    } catch (error) {
      console.warn("⚠️ Aviso: O envio real por SMTP falhou (provavelmente credenciais dummy), mas o log acima mostra o conteúdo para teste.");
    }
  }
}
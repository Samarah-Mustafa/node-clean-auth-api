import { z } from "zod";

// Schema para validar a senha crua (antes do hash)
export const passwordComplexitySchema = z.string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
  .regex(/\d/, "Deve conter pelo menos um número")
  .regex(/[@$!%*?&]/, "Deve conter pelo menos um caractere especial");

// 1. Definimos o Schema (o contrato de validação)
export const userSchema = z.object({
  id: z.string().uuid().optional(), // Valida se é um UUID válido
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email(),
  password: z.string(), // Aceita o hash da senha
  isVerified: z.boolean().optional().default(false),
});

// 2. Extraímos o Tipo automaticamente do Schema
export type UserProps = z.infer<typeof userSchema>;

export class User {
  public readonly props: UserProps;

  constructor(props: UserProps) {
    // O .parse do Zod valida tudo de uma vez. 
    // Se algo estiver errado, ele lança um erro detalhado automaticamente.
    this.props = userSchema.parse(props);
  }

  // Getters para facilitar o acesso
  get name() { return this.props.name; }
  get email() { return this.props.email; }
  get password() { return this.props.password; }
  get isVerified() { return this.props.isVerified; }
}
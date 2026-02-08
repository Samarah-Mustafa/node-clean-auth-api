import type { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  // Deleta todos os registros existentes para evitar duplicidade
  await knex("users").del();

  // Gera o hash da senha "Senha@123"
  const hashedPassword = await bcrypt.hash("Senha@123", 12);

  // Insere usuários de teste
  await knex("users").insert([
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Usuário Verificado",
      email: "verificado@teste.com",
      password: hashedPassword,
      is_verified: true
    }
  ]);
}
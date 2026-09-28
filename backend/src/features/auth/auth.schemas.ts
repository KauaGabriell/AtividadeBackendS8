import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .max(254, "O e-mail deve ter até 254 caracteres.")
  .email("Informe um e-mail válido.")
  .transform((email) => email.toLowerCase());

export const registerSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres.").max(100, "O nome deve ter até 100 caracteres."),
  email: emailSchema,
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.").max(128, "A senha deve ter até 128 caracteres."),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe a senha.").max(128, "A senha deve ter até 128 caracteres."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

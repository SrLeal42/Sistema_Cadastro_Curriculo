import { z } from "zod";

export const candidateSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório").max(255, "Máximo de 255 caracteres"),
  email: z.string().email("E-mail inválido (necessário @)").max(255, "Máximo de 255 caracteres"),
  phone: z.string().max(50, "Máximo de 50 caracteres").optional(),
  desiredRole: z.string().max(100, "Máximo de 100 caracteres").optional(),
  summary: z.string().optional()
});

export type CandidateFormData = z.infer<typeof candidateSchema>;

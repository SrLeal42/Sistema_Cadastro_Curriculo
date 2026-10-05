import { z } from "zod";

export const candidateSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  desiredRole: z.string().optional(),
  summary: z.string().optional()
});

export type CandidateFormData = z.infer<typeof candidateSchema>;

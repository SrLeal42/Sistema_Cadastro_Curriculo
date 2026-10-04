import { Request, Response } from "express";
import db from "../../config/db";
import { candidateSchema } from "./schema.zod";

export const createCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = candidateSchema.parse(req.body);

    const existingCandidate = await db("Candidates")
      .where({ Email: validatedData.email })
      .first();

    if (existingCandidate) {
      res.status(400).json({ error: "E-mail já cadastrado" });
      return;
    }

    const result = await db("Candidates")
      .insert({
        FullName: validatedData.fullName,
        Email: validatedData.email,
        Phone: validatedData.phone || null,
        DesiredRole: validatedData.desiredRole || null,
        Summary: validatedData.summary || null,
      }, ["Id"]);

    res.status(201).json({ success: true, id: result[0]?.Id || result[0] });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: "Erro de validação", details: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
};

export const getCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidates = await db("Candidates").select("*").orderBy("CreatedAt", "desc");
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const candidate = await db("Candidates").where({ Id: id }).first();

    if (!candidate) {
      res.status(404).json({ error: "Candidato não encontrado" });
      return;
    }

    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

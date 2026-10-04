import { Router } from "express";
import { createCandidate, getCandidates, getCandidateById } from "./candidate.controller";

const router = Router();

router.post("/", createCandidate);
router.get("/", getCandidates);
router.get("/:id", getCandidateById);

export default router;

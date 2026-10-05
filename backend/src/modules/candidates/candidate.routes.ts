import { Router } from "express";
import { createCandidate, getCandidates, getCandidateById, parsePdf } from "./candidate.controller";
import { upload } from "../../middlewares/upload";

const router = Router();

router.post("/parse-pdf", (req, res, next) => {

  upload.single('resume')(req, res, (err) => {

    if (err) {

      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: "Apenas arquivos PDF são permitidos." });
      }

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "O arquivo excede o tamanho máximo permitido de 5MB." });
      }

      return res.status(500).json({ error: "Erro no upload do arquivo." });
    }

    next();
  });

}, parsePdf);

router.post("/", createCandidate);
router.get("/", getCandidates);
router.get("/:id", getCandidateById);

export default router;

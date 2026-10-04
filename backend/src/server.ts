import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import candidateRoutes from "./modules/candidates/candidate.routes";
app.use("/api/candidates", candidateRoutes);

const PORT = process.env.PORT || 3000;

app.get("/health", async (req, res) => {
  try {
    await db.raw("SELECT 1 AS result");
    res.json({ status: "OK", database: "Connected" });
  } catch (error) {
    res.status(500).json({ status: "ERROR", database: "Disconnected", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

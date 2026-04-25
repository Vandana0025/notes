import express from "express";
import cors from "cors";
import { authRouter } from "./auth";
import { notesRouter } from "./notes";
import { authMiddleware } from "./middleware";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/notes", authMiddleware, notesRouter);

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

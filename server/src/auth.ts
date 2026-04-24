import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { readDB, writeDB } from "./db";

export const authRouter = Router();
const SECRET = process.env.JWT_SECRET || "sticky_secret_2024";

authRouter.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  if (!name || !email || !password) {
    res.status(400).json({ error: "All fields required" });
    return;
  }
  const db = readDB();
  if (db.users.find((u) => u.email === email)) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, password: hashed, createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDB(db);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const db = readDB();
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

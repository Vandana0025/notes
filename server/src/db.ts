import fs from "fs";
import path from "path";
import { DB } from "./types";

const DB_PATH = path.join(__dirname, "../../data/db.json");

export function readDB(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const empty: DB = { users: [], notes: [] };
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

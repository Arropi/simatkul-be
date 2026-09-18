import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { dosen } from "../../config/schema.js";

export async function getAllDosen() {
  return await db.select().from(dosen);
}

export async function getDosenById(id) {
  const result = await db.select().from(dosen).where(eq(dosen.id, id)).limit(1);
  return result[0] || null;
}

export async function createDosen(data) {
  const result = await db.insert(dosen).values(data).returning();
  return result[0];
}

export async function updateDosen(id, data) {
  const result = await db.update(dosen).set(data).where(eq(dosen.id, id)).returning();
  return result[0] || null;
}

export async function deleteDosen(id) {
  const result = await db.delete(dosen).where(eq(dosen.id, id)).returning();
  return result[0] || null;
}

import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { sesi } from "../../config/schema.js";

export async function getAllSesi() {
  return await db.select().from(sesi);
}

export async function getSesiById(id) {
  const result = await db.select().from(sesi).where(eq(sesi.id, id)).limit(1);
  return result[0] || null;
}

export async function createSesi(data) {
  const result = await db.insert(sesi).values(data).returning();
  return result[0];
}

export async function updateSesi(id, data) {
  const result = await db.update(sesi).set(data).where(eq(sesi.id, id)).returning();
  return result[0] || null;
}

export async function deleteSesi(id) {
  const result = await db.delete(sesi).where(eq(sesi.id, id)).returning();
  return result[0] || null;
}

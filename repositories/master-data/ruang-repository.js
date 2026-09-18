import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { ruang } from "../../config/schema.js";

export async function getAllRuang() {
  return await db.select().from(ruang);
}

export async function getRuangById(id) {
  const result = await db.select().from(ruang).where(eq(ruang.id, id)).limit(1);
  return result[0] || null;
}

export async function createRuang(data) {
  const result = await db.insert(ruang).values(data).returning();
  return result[0];
}

export async function updateRuang(id, data) {
  const result = await db.update(ruang).set(data).where(eq(ruang.id, id)).returning();
  return result[0] || null;
}

export async function deleteRuang(id) {
  const result = await db.delete(ruang).where(eq(ruang.id, id)).returning();
  return result[0] || null;
}

import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { mataKuliah } from "../../config/schema.js";

export async function getAllMataKuliah() {
  return await db.select().from(mataKuliah);
}

export async function getMataKuliahById(id) {
  const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id)).limit(1);
  return result[0] || null;
}

export async function createMataKuliah(data) {
  const result = await db.insert(mataKuliah).values(data).returning();
  return result[0];
}

export async function updateMataKuliah(id, data) {
  const result = await db.update(mataKuliah).set(data).where(eq(mataKuliah.id, id)).returning();
  return result[0] || null;
}

export async function deleteMataKuliah(id) {
  const result = await db.delete(mataKuliah).where(eq(mataKuliah.id, id)).returning();
  return result[0] || null;
}

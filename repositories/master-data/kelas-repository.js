import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { kelas } from "../../config/schema.js";

export async function getAllKelas() {
  return await db.select().from(kelas);
}

export async function getKelasById(id) {
  const result = await db.select().from(kelas).where(eq(kelas.id, id)).limit(1);
  return result[0] || null;
}

export async function createKelas(data) {
  const result = await db.insert(kelas).values(data).returning();
  return result[0];
}

export async function updateKelas(id, data) {
  const result = await db.update(kelas).set(data).where(eq(kelas.id, id)).returning();
  return result[0] || null;
}

export async function deleteKelas(id) {
  const result = await db.delete(kelas).where(eq(kelas.id, id)).returning();
  return result[0] || null;
}

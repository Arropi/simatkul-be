import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { ruang, kurikulumRuang } from "../../config/schema.js";

export async function getAllRuang(kurikulumId) {
  if (kurikulumId) {
    return await db
      .select({
        id: ruang.id,
        nama: ruang.nama,
      })
      .from(ruang)
      .innerJoin(kurikulumRuang, eq(ruang.id, kurikulumRuang.ruang_id))
      .where(eq(kurikulumRuang.kurikulum_id, kurikulumId));
  }
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

export async function linkKurikulumRuang(kurikulumId, ruangId) {
  const result = await db
    .insert(kurikulumRuang)
    .values({
      kurikulum_id: kurikulumId,
      ruang_id: ruangId,
    })
    .returning();
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

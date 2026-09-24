import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { dosen, kurikulumDosen } from "../../config/schema.js";

export async function getAllDosen(kurikulumId) {
  if (kurikulumId) {
    return await db
      .select({
        id: dosen.id,
        nama: dosen.nama,
        nidn: dosen.nidn,
        jabatan_akademik: dosen.jabatan_akademik,
      })
      .from(dosen)
      .innerJoin(kurikulumDosen, eq(dosen.id, kurikulumDosen.dosen_id))
      .where(eq(kurikulumDosen.kurikulum_id, kurikulumId));
  }
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

export async function linkKurikulumDosen(kurikulumId, dosenId) {
  const result = await db
    .insert(kurikulumDosen)
    .values({
      kurikulum_id: kurikulumId,
      dosen_id: dosenId,
    })
    .returning();
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

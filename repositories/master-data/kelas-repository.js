import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { kelas, kurikulumKelas } from "../../config/schema.js";

export async function getAllKelas(kurikulumId) {
  if (kurikulumId) {
    return await db
      .select({
        id: kelas.id,
        prodi: kelas.prodi,
        semester: kelas.semester,
        kelas: kelas.kelas,
        kode_kelas: kelas.kode_kelas,
      })
      .from(kelas)
      .innerJoin(kurikulumKelas, eq(kelas.id, kurikulumKelas.kelas_id))
      .where(eq(kurikulumKelas.kurikulum_id, kurikulumId));
  }
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

export async function linkKurikulumKelas(kurikulumId, kelasId) {
  const result = await db
    .insert(kurikulumKelas)
    .values({
      kurikulum_id: kurikulumId,
      kelas_id: kelasId,
    })
    .returning();
  return result[0];
}

export async function unlinkKurikulumKelas(kelasId) {
  return await db.delete(kurikulumKelas).where(eq(kurikulumKelas.kelas_id, kelasId)).returning();
}

export async function updateKelas(id, data) {
  const result = await db.update(kelas).set(data).where(eq(kelas.id, id)).returning();
  return result[0] || null;
}

export async function deleteKelas(id) {
  await unlinkKurikulumKelas(id);
  const result = await db.delete(kelas).where(eq(kelas.id, id)).returning();
  return result[0] || null;
}

import { eq, and, inArray } from "drizzle-orm";
import { db } from "../../config/database.js";
import { kelas, kurikulumKelas } from "../../config/schema.js";

export async function getAllKelas() {
  return await db.select().from(kelas);
}

export async function getAllKelasByKurikulum(kurikulumId) {
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

export async function getKelasByKurikulumAndSemester(kurikulumId, semester) {
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
    .where(
      and(
        eq(kurikulumKelas.kurikulum_id, kurikulumId),
        eq(kelas.semester, semester)
      )
    );
}

export async function createKelasBatch(kelasList) {
  if (!kelasList || kelasList.length === 0) return [];
  return await db.insert(kelas).values(kelasList).returning();
}


export async function linkKurikulumKelasBatch(links) {
  if (!links || links.length === 0) return [];
  return await db.insert(kurikulumKelas).values(links).returning();
}

export async function updateKelas(id, data) {
  const result = await db.update(kelas).set(data).where(eq(kelas.id, id)).returning();
  return result[0] || null;
}

export async function deleteKelasByKurikulumAndSemester(kurikulumId, semester) {
  const existing = await getKelasByKurikulumAndSemester(kurikulumId, semester);
  if (!existing || existing.length === 0) {
    return [];
  }
  const idsToDelete = existing.map((k) => k.id);
  const deleted = await db
    .delete(kelas)
    .where(inArray(kelas.id, idsToDelete))
    .returning();
  return deleted;
}


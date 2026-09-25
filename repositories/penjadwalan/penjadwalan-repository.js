import { eq, and, asc } from "drizzle-orm";
import { db } from "../../config/database.js";
import { penjadwalan, kelas, ruang, dosen, mataKuliah } from "../../config/schema.js";

export async function getAllPenjadwalanByKurikulumId(kurikulumId) {
  return await db
    .select()
    .from(penjadwalan)
    .where(eq(penjadwalan.kurikulum_id, kurikulumId))
    .orderBy(asc(penjadwalan.id));
}

export async function getExistingSchedulesBySlot(kurikulumId, sesiId, hari) {
  return await db
    .select({
      id: penjadwalan.id,
      kurikulum_id: penjadwalan.kurikulum_id,
      matkul_id: penjadwalan.matkul_id,
      dosen_id: penjadwalan.dosen_id,
      ruang_id: penjadwalan.ruang_id,
      sesi_id: penjadwalan.sesi_id,
      kelas_id: penjadwalan.kelas_id,
      hari: penjadwalan.hari,
      kode_kelas: kelas.kode_kelas,
      prodi: kelas.prodi,
      semester: kelas.semester,
      kelas: kelas.kelas,
      nama_ruang: ruang.nama,
      nama_dosen: dosen.nama,
    })
    .from(penjadwalan)
    .innerJoin(kelas, eq(penjadwalan.kelas_id, kelas.id))
    .innerJoin(ruang, eq(penjadwalan.ruang_id, ruang.id))
    .innerJoin(dosen, eq(penjadwalan.dosen_id, dosen.id))
    .where(
      and(
        eq(penjadwalan.kurikulum_id, kurikulumId),
        eq(penjadwalan.sesi_id, sesiId),
        eq(penjadwalan.hari, hari)
      )
    );
}

export async function createPenjadwalan(data) {
  const result = await db.insert(penjadwalan).values(data).returning();
  return result[0];
}

export async function getPenjadwalanById(id) {
  const result = await db
    .select({
      id: penjadwalan.id,
      kurikulum_id: penjadwalan.kurikulum_id,
      matkul_id: penjadwalan.matkul_id,
      dosen_id: penjadwalan.dosen_id,
      ruang_id: penjadwalan.ruang_id,
      sesi_id: penjadwalan.sesi_id,
      kelas_id: penjadwalan.kelas_id,
      hari: penjadwalan.hari,
      kode_kelas: kelas.kode_kelas,
      nama_matkul: mataKuliah.nama,
      nama_dosen: dosen.nama,
      nama_ruang: ruang.nama,
    })
    .from(penjadwalan)
    .innerJoin(kelas, eq(penjadwalan.kelas_id, kelas.id))
    .innerJoin(mataKuliah, eq(penjadwalan.matkul_id, mataKuliah.id))
    .innerJoin(dosen, eq(penjadwalan.dosen_id, dosen.id))
    .innerJoin(ruang, eq(penjadwalan.ruang_id, ruang.id))
    .where(eq(penjadwalan.id, id))
    .limit(1);

  return result[0] || null;
}

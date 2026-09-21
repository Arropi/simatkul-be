import { eq, sql, asc } from "drizzle-orm";
import { db } from "../../config/database.js";
import {
  kurikulum,
  kelas,
  kurikulumDosen,
  kurikulumRuang,
  kurikulumKelas,
  kurikulumMataKuliah,
  kurikulumSesi,
} from "../../config/schema.js";

// Relasi Kurikulum
const totalMataKuliahSql = sql`COALESCE((SELECT COUNT(*)::int FROM "kurikulum_mata_kuliah" WHERE "kurikulum_mata_kuliah"."kurikulum_id" = "kurikulum"."id"), 0)`.as("total_mata_kuliah");
const totalSesiSql = sql`COALESCE((SELECT COUNT(*)::int FROM "kurikulum_sesi" WHERE "kurikulum_sesi"."kurikulum_id" = "kurikulum"."id"), 0)`.as("total_sesi");
const totalDosenSql = sql`COALESCE((SELECT COUNT(*)::int FROM "kurikulum_dosen" WHERE "kurikulum_dosen"."kurikulum_id" = "kurikulum"."id"), 0)`.as("total_dosen");
const totalKelasSql = sql`COALESCE((SELECT COUNT(*)::int FROM "kurikulum_kelas" WHERE "kurikulum_kelas"."kurikulum_id" = "kurikulum"."id"), 0)`.as("total_kelas");
const totalRuangSql = sql`COALESCE((SELECT COUNT(*)::int FROM "kurikulum_ruang" WHERE "kurikulum_ruang"."kurikulum_id" = "kurikulum"."id"), 0)`.as("total_ruang");

export async function getAllKurikulum() {
  return await db
    .select({
      id: kurikulum.id,
      semester: kurikulum.semester,
      tahun: kurikulum.tahun,
      description: kurikulum.description,
      total_mata_kuliah: totalMataKuliahSql,
      total_sesi: totalSesiSql,
      total_dosen: totalDosenSql,
      total_kelas: totalKelasSql,
      total_ruang: totalRuangSql,
    })
    .from(kurikulum)
    .orderBy(asc(kurikulum.tahun), asc(kurikulum.semester), asc(kurikulum.id));
}

export async function getKurikulumById(id) {
  const result = await db
    .select({
      id: kurikulum.id,
      semester: kurikulum.semester,
      tahun: kurikulum.tahun,
      description: kurikulum.description,
      total_mata_kuliah: totalMataKuliahSql,
      total_sesi: totalSesiSql,
      total_dosen: totalDosenSql,
      total_kelas: totalKelasSql,
      total_ruang: totalRuangSql,
    })
    .from(kurikulum)
    .where(eq(kurikulum.id, id))
    .limit(1);

  return result[0] || null;
}

export async function createKurikulum(data) {
  const result = await db.insert(kurikulum).values(data).returning();
  return result[0];
}

export async function updateKurikulum(id, data) {
  const result = await db.update(kurikulum).set(data).where(eq(kurikulum.id, id)).returning();
  return result[0] || null;
}

export async function deleteKurikulum(id) {
  await db.delete(kurikulumDosen).where(eq(kurikulumDosen.kurikulum_id, id));
  await db.delete(kurikulumRuang).where(eq(kurikulumRuang.kurikulum_id, id));
  await db.delete(kurikulumKelas).where(eq(kurikulumKelas.kurikulum_id, id));
  await db.delete(kurikulumMataKuliah).where(eq(kurikulumMataKuliah.kurikulum_id, id));
  await db.delete(kurikulumSesi).where(eq(kurikulumSesi.kurikulum_id, id));
  const result = await db.delete(kurikulum).where(eq(kurikulum.id, id)).returning();
  return result[0] || null;
}

export async function copyKurikulumRelations(sourceKurikulumId, targetKurikulumId) {
  // 1. Copy kurikulum_dosen
  const dosenRelations = await db
    .select({ dosen_id: kurikulumDosen.dosen_id })
    .from(kurikulumDosen)
    .where(eq(kurikulumDosen.kurikulum_id, sourceKurikulumId));

  if (dosenRelations.length > 0) {
    await db.insert(kurikulumDosen).values(
      dosenRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        dosen_id: r.dosen_id,
      }))
    );
  }

  // 2. Copy kurikulum_ruang
  const ruangRelations = await db
    .select({ ruang_id: kurikulumRuang.ruang_id })
    .from(kurikulumRuang)
    .where(eq(kurikulumRuang.kurikulum_id, sourceKurikulumId));

  if (ruangRelations.length > 0) {
    await db.insert(kurikulumRuang).values(
      ruangRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        ruang_id: r.ruang_id,
      }))
    );
  }

  // 3. Copy kurikulum_mata_kuliah
  const mataKuliahRelations = await db
    .select({ mata_kuliah_id: kurikulumMataKuliah.mata_kuliah_id })
    .from(kurikulumMataKuliah)
    .where(eq(kurikulumMataKuliah.kurikulum_id, sourceKurikulumId));

  if (mataKuliahRelations.length > 0) {
    await db.insert(kurikulumMataKuliah).values(
      mataKuliahRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        mata_kuliah_id: r.mata_kuliah_id,
      }))
    );
  }

  // 4. Copy kurikulum_sesi
  const sesiRelations = await db
    .select({ sesi_id: kurikulumSesi.sesi_id })
    .from(kurikulumSesi)
    .where(eq(kurikulumSesi.kurikulum_id, sourceKurikulumId));

  if (sesiRelations.length > 0) {
    await db.insert(kurikulumSesi).values(
      sesiRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        sesi_id: r.sesi_id,
      }))
    );
  }

  // 5. Copy kelas & kurikulum_kelas
  // Membuat kelas baru dengan isi yang sama, kemudian mengubah semua kurikulum_kelas dengan kelas_id yang baru
  const sourceKelasList = await db
    .select({
      prodi: kelas.prodi,
      semester: kelas.semester,
      kelas: kelas.kelas,
      kode_kelas: kelas.kode_kelas,
    })
    .from(kelas)
    .innerJoin(kurikulumKelas, eq(kelas.id, kurikulumKelas.kelas_id))
    .where(eq(kurikulumKelas.kurikulum_id, sourceKurikulumId));

  for (const item of sourceKelasList) {
    const [newKelas] = await db
      .insert(kelas)
      .values({
        prodi: item.prodi,
        semester: item.semester,
        kelas: item.kelas,
        kode_kelas: item.kode_kelas,
      })
      .returning();

    await db.insert(kurikulumKelas).values({
      kurikulum_id: targetKurikulumId,
      kelas_id: newKelas.id,
    });
  }
}

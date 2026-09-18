import { eq, sql, asc } from "drizzle-orm";
import { db } from "../../config/database.js";
import { kurikulum } from "../../config/schema.js";

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
  const result = await db.delete(kurikulum).where(eq(kurikulum.id, id)).returning();
  return result[0] || null;
}

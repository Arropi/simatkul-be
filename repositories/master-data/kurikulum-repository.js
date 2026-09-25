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
  dosen,
  ruang,
  mataKuliah,
  sesi,
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
  const result = await db.delete(kurikulum).where(eq(kurikulum.id, id)).returning();
  return result[0] || null;
}

export async function copyKurikulumRelations(sourceKurikulumId, targetKurikulumId) {
  // 1. Copy kurikulum_dosen
  const dosenRelations = await db
    .insert(dosen)
    .select(
      db
        .select({
          nama: dosen.nama,
          nidn: dosen.nidn,
          jabatan_akademik: dosen.jabatan_akademik,
        })
        .from(kurikulumDosen)
        .innerJoin(dosen, eq(kurikulumDosen.dosen_id, dosen.id))
        .where(eq(kurikulumDosen.kurikulum_id, sourceKurikulumId))
    )
    .returning();

  if (dosenRelations.length > 0) {
    await db.insert(kurikulumDosen).values(
      dosenRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        dosen_id: r.id,
      }))
    );
  }

  // 2. Copy kurikulum_ruang
  const ruangRelations = await db
    .insert(ruang)
    .select(
      db
        .select({
          nama: ruang.nama,
        })
        .from(kurikulumRuang)
        .innerJoin(ruang, eq(kurikulumRuang.ruang_id, ruang.id))
        .where(eq(kurikulumRuang.kurikulum_id, sourceKurikulumId))
    )
    .returning();

  if (ruangRelations.length > 0) {
    await db.insert(kurikulumRuang).values(
      ruangRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        ruang_id: r.id,
      }))
    );
  }

  // 3. Copy kurikulum_mata_kuliah
  const mataKuliahRelations = await db
    .insert(mataKuliah)
    .select(
      db
        .select({
          kode: mataKuliah.kode,
          nama: mataKuliah.nama,
          sks: mataKuliah.sks,
          prodi: mataKuliah.prodi,
          jenis: mataKuliah.jenis,
          kelompok: mataKuliah.kelompok,
          tipe_kelas: mataKuliah.tipe_kelas,
          semester: mataKuliah.semester,
        })
        .from(kurikulumMataKuliah)
        .innerJoin(mataKuliah, eq(kurikulumMataKuliah.mata_kuliah_id, mataKuliah.id))
        .where(eq(kurikulumMataKuliah.kurikulum_id, sourceKurikulumId))
    )
    .returning();

  if (mataKuliahRelations.length > 0) {
    await db.insert(kurikulumMataKuliah).values(
      mataKuliahRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        mata_kuliah_id: r.id,
      }))
    );
  }

  // 4. Copy kurikulum_sesi
  const sesiRelations = await db
    .insert(sesi)
    .select(
      db
        .select({
          jam_mulai: sesi.jam_mulai,
          jam_akhir: sesi.jam_akhir,
        })
        .from(kurikulumSesi)
        .innerJoin(sesi, eq(kurikulumSesi.sesi_id, sesi.id))
        .where(eq(kurikulumSesi.kurikulum_id, sourceKurikulumId))
    )
    .returning();

  if (sesiRelations.length > 0) {
    await db.insert(kurikulumSesi).values(
      sesiRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        sesi_id: r.id,
      }))
    );
  }

  // 5. Copy kurikulum_kelas
  const kelasRelations = await db
    .insert(kelas)
    .select(
      db
        .select({
          prodi: kelas.prodi,
          semester: kelas.semester,
          kelas: kelas.kelas,
          kode_kelas: kelas.kode_kelas,
        })
        .from(kurikulumKelas)
        .innerJoin(kelas, eq(kurikulumKelas.kelas_id, kelas.id))
        .where(eq(kurikulumKelas.kurikulum_id, sourceKurikulumId))
    )
    .returning();

  if (kelasRelations.length > 0) {
    await db.insert(kurikulumKelas).values(
      kelasRelations.map((r) => ({
        kurikulum_id: targetKurikulumId,
        kelas_id: r.id,
      }))
    );
  }
}

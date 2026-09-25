import { eq, and, asc } from "drizzle-orm";
import { db } from "../../config/database.js";
import {
  kurikulum,
  ruang,
  kurikulumRuang,
  dosen,
  kurikulumDosen,
  sesi,
  kurikulumSesi,
  kelas,
  kurikulumKelas,
  mataKuliah,
  kurikulumMataKuliah,
} from "../../config/schema.js";

export async function checkKurikulumExists(kurikulumId) {
  const result = await db
    .select({ id: kurikulum.id })
    .from(kurikulum)
    .where(eq(kurikulum.id, kurikulumId))
    .limit(1);

  return result.length > 0;
}

export async function getRuangByKurikulumId(kurikulumId) {
  return await db
    .select({
      id: ruang.id,
      nama: ruang.nama,
    })
    .from(kurikulumRuang)
    .innerJoin(ruang, eq(kurikulumRuang.ruang_id, ruang.id))
    .where(eq(kurikulumRuang.kurikulum_id, kurikulumId))
    .orderBy(asc(ruang.nama), asc(ruang.id));
}

export async function getDosenByKurikulumId(kurikulumId) {
  return await db
    .select({
      id: dosen.id,
      nama: dosen.nama,
    })
    .from(kurikulumDosen)
    .innerJoin(dosen, eq(kurikulumDosen.dosen_id, dosen.id))
    .where(eq(kurikulumDosen.kurikulum_id, kurikulumId))
    .orderBy(asc(dosen.nama), asc(dosen.id));
}

export async function getSesiByKurikulumId(kurikulumId) {
  return await db
    .select({
      id: sesi.id,
      jam_mulai: sesi.jam_mulai,
      jam_akhir: sesi.jam_akhir,
    })
    .from(kurikulumSesi)
    .innerJoin(sesi, eq(kurikulumSesi.sesi_id, sesi.id))
    .where(eq(kurikulumSesi.kurikulum_id, kurikulumId))
    .orderBy(asc(sesi.jam_mulai), asc(sesi.id));
}

export async function getKelasByKurikulumId(kurikulumId) {
  return await db
    .select({
      id: kelas.id,
      kode_kelas: kelas.kode_kelas,
      prodi: kelas.prodi,
      semester: kelas.semester,
      kelas: kelas.kelas,
    })
    .from(kurikulumKelas)
    .innerJoin(kelas, eq(kurikulumKelas.kelas_id, kelas.id))
    .where(eq(kurikulumKelas.kurikulum_id, kurikulumId))
    .orderBy(asc(kelas.prodi), asc(kelas.kode_kelas), asc(kelas.id));
}

export async function getMataKuliahByKurikulumId(kurikulumId) {
  return await db
    .select({
      id: mataKuliah.id,
      nama: mataKuliah.nama,
      prodi: mataKuliah.prodi,
    })
    .from(kurikulumMataKuliah)
    .innerJoin(mataKuliah, eq(kurikulumMataKuliah.mata_kuliah_id, mataKuliah.id))
    .where(eq(kurikulumMataKuliah.kurikulum_id, kurikulumId))
    .orderBy(asc(mataKuliah.prodi), asc(mataKuliah.nama), asc(mataKuliah.id));
}

export async function getKelasByIdAndKurikulum(kelasId, kurikulumId) {
  const result = await db
    .select({
      id: kelas.id,
      prodi: kelas.prodi,
      semester: kelas.semester,
      kelas: kelas.kelas,
      kode_kelas: kelas.kode_kelas,
    })
    .from(kurikulumKelas)
    .innerJoin(kelas, eq(kurikulumKelas.kelas_id, kelas.id))
    .where(
      and(
        eq(kurikulumKelas.kurikulum_id, kurikulumId),
        eq(kurikulumKelas.kelas_id, kelasId)
      )
    )
    .limit(1);

  return result[0] || null;
}

export async function getMataKuliahByIdAndKurikulum(matkulId, kurikulumId) {
  const result = await db
    .select({
      id: mataKuliah.id,
      kode: mataKuliah.kode,
      nama: mataKuliah.nama,
    })
    .from(kurikulumMataKuliah)
    .innerJoin(mataKuliah, eq(kurikulumMataKuliah.mata_kuliah_id, mataKuliah.id))
    .where(
      and(
        eq(kurikulumMataKuliah.kurikulum_id, kurikulumId),
        eq(kurikulumMataKuliah.mata_kuliah_id, matkulId)
      )
    )
    .limit(1);

  return result[0] || null;
}

export async function getDosenByIdAndKurikulum(dosenId, kurikulumId) {
  const result = await db
    .select({
      id: dosen.id,
      nama: dosen.nama,
    })
    .from(kurikulumDosen)
    .innerJoin(dosen, eq(kurikulumDosen.dosen_id, dosen.id))
    .where(
      and(
        eq(kurikulumDosen.kurikulum_id, kurikulumId),
        eq(kurikulumDosen.dosen_id, dosenId)
      )
    )
    .limit(1);

  return result[0] || null;
}

export async function getRuangByIdAndKurikulum(ruangId, kurikulumId) {
  const result = await db
    .select({
      id: ruang.id,
      nama: ruang.nama,
    })
    .from(kurikulumRuang)
    .innerJoin(ruang, eq(kurikulumRuang.ruang_id, ruang.id))
    .where(
      and(
        eq(kurikulumRuang.kurikulum_id, kurikulumId),
        eq(kurikulumRuang.ruang_id, ruangId)
      )
    )
    .limit(1);

  return result[0] || null;
}

export async function getSesiByIdAndKurikulum(sesiId, kurikulumId) {
  const result = await db
    .select({
      id: sesi.id,
      jam_mulai: sesi.jam_mulai,
      jam_akhir: sesi.jam_akhir,
    })
    .from(kurikulumSesi)
    .innerJoin(sesi, eq(kurikulumSesi.sesi_id, sesi.id))
    .where(
      and(
        eq(kurikulumSesi.kurikulum_id, kurikulumId),
        eq(kurikulumSesi.sesi_id, sesiId)
      )
    )
    .limit(1);

  return result[0] || null;
}

export async function getBaseKelasById(id) {
  const result = await db.select().from(kelas).where(eq(kelas.id, id)).limit(1);
  return result[0] || null;
}

export async function getBaseMataKuliahById(id) {
  const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id)).limit(1);
  return result[0] || null;
}

export async function getBaseDosenById(id) {
  const result = await db.select().from(dosen).where(eq(dosen.id, id)).limit(1);
  return result[0] || null;
}

export async function getBaseRuangById(id) {
  const result = await db.select().from(ruang).where(eq(ruang.id, id)).limit(1);
  return result[0] || null;
}

export async function getBaseSesiById(id) {
  const result = await db.select().from(sesi).where(eq(sesi.id, id)).limit(1);
  return result[0] || null;
}

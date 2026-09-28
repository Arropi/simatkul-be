import { eq, and, asc, sql } from "drizzle-orm";
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

export async function getFormOptionsRaw(kurikulumId) {
  const result = await db.execute(sql`
    SELECT
      EXISTS(SELECT 1 FROM kurikulum WHERE id = ${kurikulumId}) AS kurikulum_exists,
      COALESCE(
        (
          SELECT json_agg(json_build_object('id', r.id::int, 'nama', r.nama) ORDER BY r.nama ASC, r.id ASC)
          FROM kurikulum_ruang kr
          INNER JOIN ruang r ON kr.ruang_id = r.id
          WHERE kr.kurikulum_id = ${kurikulumId}
        ),
        '[]'::json
      ) AS ruang,
      COALESCE(
        (
          SELECT json_agg(json_build_object('id', d.id::int, 'nama', d.nama) ORDER BY d.nama ASC, d.id ASC)
          FROM kurikulum_dosen kd
          INNER JOIN dosen d ON kd.dosen_id = d.id
          WHERE kd.kurikulum_id = ${kurikulumId}
        ),
        '[]'::json
      ) AS dosen,
      COALESCE(
        (
          SELECT json_agg(json_build_object('id', s.id::int, 'jam_mulai', s.jam_mulai::text, 'jam_akhir', s.jam_akhir::text) ORDER BY s.jam_mulai ASC, s.id ASC)
          FROM kurikulum_sesi ks
          INNER JOIN sesi s ON ks.sesi_id = s.id
          WHERE ks.kurikulum_id = ${kurikulumId}
        ),
        '[]'::json
      ) AS sesi,
      COALESCE(
        (
          SELECT json_agg(json_build_object('id', k.id::int, 'kode_kelas', k.kode_kelas, 'prodi', k.prodi, 'semester', k.semester::int, 'kelas', k.kelas) ORDER BY k.prodi ASC, k.kode_kelas ASC, k.id ASC)
          FROM kurikulum_kelas kk
          INNER JOIN kelas k ON kk.kelas_id = k.id
          WHERE kk.kurikulum_id = ${kurikulumId}
        ),
        '[]'::json
      ) AS kelas,
      COALESCE(
        (
          SELECT json_agg(json_build_object('id', mk.id::int, 'nama', mk.nama, 'prodi', mk.prodi) ORDER BY mk.prodi ASC, mk.nama ASC, mk.id ASC)
          FROM kurikulum_mata_kuliah kmk
          INNER JOIN mata_kuliah mk ON kmk.mata_kuliah_id = mk.id
          WHERE kmk.kurikulum_id = ${kurikulumId}
        ),
        '[]'::json
      ) AS mata_kuliah;
  `);

  const rows = result.rows || result || [];
  return rows[0] || null;
}

export async function validatePenjadwalanMasterDataRaw({ kurikulumId, kelasId, matkulId, ruangId, dosenIds, sesiIds }) {
  const dList = (dosenIds || []).map(Number);
  const sList = (sesiIds || []).map(Number);

  const dArray = dList.length > 0
    ? sql`ARRAY[${sql.join(dList.map((id) => sql`${id}::bigint`), sql`, `)}]`
    : sql`ARRAY[]::bigint[]`;

  const sArray = sList.length > 0
    ? sql`ARRAY[${sql.join(sList.map((id) => sql`${id}::bigint`), sql`, `)}]`
    : sql`ARRAY[]::bigint[]`;

  const result = await db.execute(sql`
    SELECT
      EXISTS(SELECT 1 FROM kurikulum WHERE id = ${kurikulumId}) AS kurikulum_exists,

      (SELECT json_build_object(
        'exists', true,
        'in_kurikulum', EXISTS(SELECT 1 FROM kurikulum_kelas WHERE kurikulum_id = ${kurikulumId} AND kelas_id = ${kelasId}),
        'data', json_build_object('id', k.id::int, 'kode_kelas', k.kode_kelas, 'prodi', k.prodi, 'semester', k.semester::int, 'kelas', k.kelas)
      ) FROM kelas k WHERE k.id = ${kelasId}) AS kelas_info,

      (SELECT json_build_object(
        'exists', true,
        'in_kurikulum', EXISTS(SELECT 1 FROM kurikulum_mata_kuliah WHERE kurikulum_id = ${kurikulumId} AND mata_kuliah_id = ${matkulId}),
        'data', json_build_object('id', mk.id::int, 'nama', mk.nama, 'kode', mk.kode, 'sks', mk.sks::int)
      ) FROM mata_kuliah mk WHERE mk.id = ${matkulId}) AS matkul_info,

      (SELECT json_build_object(
        'exists', true,
        'in_kurikulum', EXISTS(SELECT 1 FROM kurikulum_ruang WHERE kurikulum_id = ${kurikulumId} AND ruang_id = ${ruangId}),
        'data', json_build_object('id', r.id::int, 'nama', r.nama)
      ) FROM ruang r WHERE r.id = ${ruangId}) AS ruang_info,

      (SELECT json_agg(json_build_object(
        'id', d.id::int,
        'nama', d.nama,
        'in_kurikulum', EXISTS(SELECT 1 FROM kurikulum_dosen kd WHERE kd.kurikulum_id = ${kurikulumId} AND kd.dosen_id = d.id)
      )) FROM dosen d WHERE d.id = ANY(${dArray})) AS dosens_info,

      (SELECT json_agg(json_build_object(
        'id', s.id::int,
        'jam_mulai', s.jam_mulai::text,
        'jam_akhir', s.jam_akhir::text,
        'in_kurikulum', EXISTS(SELECT 1 FROM kurikulum_sesi ks WHERE ks.kurikulum_id = ${kurikulumId} AND ks.sesi_id = s.id)
      )) FROM sesi s WHERE s.id = ANY(${sArray})) AS sesis_info;
  `);

  const rows = result.rows || result || [];
  return rows[0] || null;
}


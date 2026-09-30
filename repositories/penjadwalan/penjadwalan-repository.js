import { eq, asc, sql } from "drizzle-orm";
import { db } from "../../config/database.js";
import {
  penjadwalan,
  penjadwalanSesi,
  penjadwalanDosen,
} from "../../config/schema.js";

export async function getAllPenjadwalanByKurikulumId(kurikulumId) {
  return await db
    .select()
    .from(penjadwalan)
    .where(eq(penjadwalan.kurikulum_id, kurikulumId))
    .orderBy(asc(penjadwalan.id));
}

export async function getPenjadwalanWithDetailsByKurikulumId(kurikulumId) {
  const result = await db.execute(sql`
    SELECT 
      p.id::int AS id,
      p.kurikulum_id::int AS kurikulum_id,
      p.matkul_id::int AS matkul_id,
      p.ruang_id::int AS ruang_id,
      p.kelas_id::int AS kelas_id,
      p.hari,
      mk.sks::int AS sks,
      mk.kode AS kode_matkul,
      mk.nama AS nama_matkul,
      k.kode_kelas,
      r.nama AS nama_ruang,
      COALESCE(
        (
          SELECT json_agg(ps.sesi_id::int)
          FROM penjadwalan_sesi ps
          WHERE ps.penjadwalan_id = p.id
        ),
        '[]'::json
      ) AS sesi_ids,
      COALESCE(
        (
          SELECT json_agg(pd.dosen_id::int)
          FROM penjadwalan_dosen pd
          WHERE pd.penjadwalan_id = p.id
        ),
        '[]'::json
      ) AS dosen_ids,
      COALESCE(
        (
          SELECT json_agg(d.nama ORDER BY d.nama ASC)
          FROM penjadwalan_dosen pd
          INNER JOIN dosen d ON pd.dosen_id = d.id
          WHERE pd.penjadwalan_id = p.id
        ),
        '[]'::json
      ) AS dosen_names
    FROM penjadwalan p
    INNER JOIN mata_kuliah mk ON p.matkul_id = mk.id
    INNER JOIN kelas k ON p.kelas_id = k.id
    INNER JOIN ruang r ON p.ruang_id = r.id
    WHERE p.kurikulum_id = ${kurikulumId}
    ORDER BY p.id ASC;
  `);
  console.log(result)

  return result.rows || result || [];
}

export async function getExistingSchedulesBySlots(kurikulumId, sesiIds, hari) {
  if (!sesiIds || sesiIds.length === 0) return [];

  const sesiList = sesiIds.map((id) => Number(id));

  const result = await db.execute(sql`
    SELECT 
      p.id::int AS id,
      p.kurikulum_id::int AS kurikulum_id,
      p.matkul_id::int AS matkul_id,
      p.ruang_id::int AS ruang_id,
      p.kelas_id::int AS kelas_id,
      p.hari,
      ps.sesi_id::int AS sesi_id,
      s.jam_mulai::text AS jam_mulai,
      s.jam_akhir::text AS jam_akhir,
      pd.dosen_id::int AS dosen_id,
      d.nama AS nama_dosen,
      k.kode_kelas,
      k.prodi,
      k.semester::int AS semester,
      k.kelas,
      r.nama AS nama_ruang
    FROM penjadwalan p
    INNER JOIN penjadwalan_sesi ps ON p.id = ps.penjadwalan_id
    INNER JOIN sesi s ON ps.sesi_id = s.id
    INNER JOIN penjadwalan_dosen pd ON p.id = pd.penjadwalan_id
    INNER JOIN dosen d ON pd.dosen_id = d.id
    INNER JOIN kelas k ON p.kelas_id = k.id
    INNER JOIN ruang r ON p.ruang_id = r.id
    WHERE p.kurikulum_id = ${kurikulumId}
      AND ps.sesi_id = ANY(ARRAY[${sql.join(sesiList.map((id) => sql`${id}::bigint`), sql`, `)}])
      AND p.hari = ${hari};
  `);

  return result.rows || result || [];
}

export async function getExistingSchedulesBySlot(kurikulumId, sesiId, hari) {
  return await getExistingSchedulesBySlots(kurikulumId, [sesiId], hari);
}

export async function createPenjadwalan(data) {
  const { sesi_ids, dosen_ids, ...penjadwalanData } = data;

  const result = await db.insert(penjadwalan).values(penjadwalanData).returning();
  const created = result[0];

  if (sesi_ids && sesi_ids.length > 0) {
    const sesiValues = sesi_ids.map((sesiId) => ({
      penjadwalan_id: created.id,
      sesi_id: Number(sesiId),
    }));
    await db.insert(penjadwalanSesi).values(sesiValues);
  }

  if (dosen_ids && dosen_ids.length > 0) {
    const dosenValues = dosen_ids.map((dosenId) => ({
      penjadwalan_id: created.id,
      dosen_id: Number(dosenId),
    }));
    await db.insert(penjadwalanDosen).values(dosenValues);
  }

  return created;
}

export async function getPenjadwalanById(id) {
  const result = await db.execute(sql`
    SELECT 
      p.id::int AS id,
      p.kurikulum_id::int AS kurikulum_id,
      p.matkul_id::int AS matkul_id,
      p.ruang_id::int AS ruang_id,
      p.kelas_id::int AS kelas_id,
      p.hari,
      k.kode_kelas,
      mk.nama AS nama_matkul,
      r.nama AS nama_ruang,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', s.id::int,
              'jam_mulai', s.jam_mulai::text,
              'jam_akhir', s.jam_akhir::text
            ) ORDER BY s.jam_mulai ASC
          )
          FROM penjadwalan_sesi ps
          INNER JOIN sesi s ON ps.sesi_id = s.id
          WHERE ps.penjadwalan_id = p.id
        ),
        '[]'::json
      ) AS sesi,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', d.id::int,
              'nama', d.nama
            ) ORDER BY d.nama ASC
          )
          FROM penjadwalan_dosen pd
          INNER JOIN dosen d ON pd.dosen_id = d.id
          WHERE pd.penjadwalan_id = p.id
        ),
        '[]'::json
      ) AS dosen
    FROM penjadwalan p
    INNER JOIN kelas k ON p.kelas_id = k.id
    INNER JOIN mata_kuliah mk ON p.matkul_id = mk.id
    INNER JOIN ruang r ON p.ruang_id = r.id
    WHERE p.id = ${id}
    LIMIT 1;
  `);

  const rows = result.rows || result || [];
  return rows[0] || null;
}

export async function getPenjadwalanFormattedRawById(id) {
  const result = await db.execute(sql`
    SELECT 
      p.id::int AS id,
      p.kurikulum_id::int AS kurikulum_id,
      p.hari,
      json_build_object(
        'id', r.id::int,
        'nama', r.nama
      ) AS ruang,
      json_build_object(
        'id', k.id::int,
        'kode_kelas', k.kode_kelas,
        'prodi', k.prodi,
        'semester', k.semester::int,
        'kelas', k.kelas
      ) AS kelas,
      json_build_object(
        'id', mk.id::int,
        'nama', mk.nama,
        'prodi', mk.prodi
      ) AS mata_kuliah,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', d.id::int,
              'nama', d.nama
            ) ORDER BY d.nama ASC, d.id ASC
          )
          FROM penjadwalan_dosen pd
          INNER JOIN dosen d ON pd.dosen_id = d.id
          WHERE pd.penjadwalan_id = p.id
        ),
        '[]'::json
      ) AS dosen,
      COALESCE(
        (
          SELECT json_agg(ps.sesi_id::int)
          FROM penjadwalan_sesi ps
          WHERE ps.penjadwalan_id = p.id
        ),
        '[]'::json
      ) AS sesi_ids
    FROM penjadwalan p
    INNER JOIN kelas k ON p.kelas_id = k.id
    INNER JOIN mata_kuliah mk ON p.matkul_id = mk.id
    INNER JOIN ruang r ON p.ruang_id = r.id
    WHERE p.id = ${id}
    LIMIT 1;
  `);

  const rows = result.rows || result || [];
  return rows[0] || null;
}

export async function updatePenjadwalan(id, data) {
  const { sesi_ids, dosen_ids, ...penjadwalanData } = data;

  let updated = null;
  if (Object.keys(penjadwalanData).length > 0) {
    const result = await db
      .update(penjadwalan)
      .set(penjadwalanData)
      .where(eq(penjadwalan.id, id))
      .returning();
    updated = result[0];
  }

  if (sesi_ids !== undefined) {
    await db.delete(penjadwalanSesi).where(eq(penjadwalanSesi.penjadwalan_id, id));
    if (sesi_ids.length > 0) {
      const sesiValues = sesi_ids.map((sesiId) => ({
        penjadwalan_id: id,
        sesi_id: Number(sesiId),
      }));
      await db.insert(penjadwalanSesi).values(sesiValues);
    }
  }

  if (dosen_ids !== undefined) {
    await db.delete(penjadwalanDosen).where(eq(penjadwalanDosen.penjadwalan_id, id));
    if (dosen_ids.length > 0) {
      const dosenValues = dosen_ids.map((dosenId) => ({
        penjadwalan_id: id,
        dosen_id: Number(dosenId),
      }));
      await db.insert(penjadwalanDosen).values(dosenValues);
    }
  }

  return updated;
}

export async function deletePenjadwalan(id) {
  const result = await db
    .delete(penjadwalan)
    .where(eq(penjadwalan.id, id))
    .returning();
  return result[0];
}

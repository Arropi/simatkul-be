import { eq, and, or, ilike, sql, count, asc, desc } from "drizzle-orm";
import { db } from "../../config/database.js";
import { mataKuliah, kurikulumMataKuliah } from "../../config/schema.js";

export async function getMataKuliahByKurikulum(kurikulumId, options = {}) {
  const {
    search,
    filters = {},
    pagination = {},
    sortBy = "id",
    order = "asc",
  } = options;

  const conditions = [eq(kurikulumMataKuliah.kurikulum_id, kurikulumId)];

  const trimmedSearch = typeof search === "string" ? search.trim() : "";
  if (trimmedSearch) {
    const searchPattern = `%${trimmedSearch}%`;
    conditions.push(
      or(
        ilike(mataKuliah.nama, searchPattern),
        sql`CAST(${mataKuliah.kode} AS TEXT) ILIKE ${searchPattern}`
      )
    );
  }

  if (filters.prodi) {
    conditions.push(ilike(mataKuliah.prodi, filters.prodi.trim()));
  }

  if (filters.semester !== undefined && filters.semester !== null) {
    if (typeof filters.semester === "number" || (!isNaN(Number(filters.semester)) && String(filters.semester).trim() !== "")) {
      conditions.push(eq(mataKuliah.semester, Number(filters.semester)));
    } else if (String(filters.semester).toLowerCase() === "ganjil") {
      conditions.push(sql`${mataKuliah.semester} % 2 != 0`);
    } else if (String(filters.semester).toLowerCase() === "genap") {
      conditions.push(sql`${mataKuliah.semester} % 2 = 0`);
    }
  }

  if (filters.jenis) {
    conditions.push(ilike(mataKuliah.jenis, filters.jenis.trim()));
  }

  if (filters.kelompok) {
    conditions.push(ilike(mataKuliah.kelompok, filters.kelompok.trim()));
  }

  const tipeKelas = filters.tipe_kelas || filters.tipeKelas;
  if (tipeKelas) {
    conditions.push(ilike(mataKuliah.tipe_kelas, tipeKelas.trim()));
  }

  if (filters.sks !== undefined && filters.sks !== null && !isNaN(Number(filters.sks))) {
    conditions.push(eq(mataKuliah.sks, Number(filters.sks)));
  }

  if (filters.kode !== undefined && filters.kode !== null && !isNaN(Number(filters.kode))) {
    conditions.push(eq(mataKuliah.kode, Number(filters.kode)));
  }

  const whereClause = and(...conditions);

  // Hitung total data yang cocok
  const countResult = await db
    .select({ total: count() })
    .from(mataKuliah)
    .innerJoin(kurikulumMataKuliah, eq(mataKuliah.id, kurikulumMataKuliah.mata_kuliah_id))
    .where(whereClause);

  const total = Number(countResult[0]?.total || 0);

  // Sorting
  const sortMap = {
    id: mataKuliah.id,
    kode: mataKuliah.kode,
    nama: mataKuliah.nama,
    sks: mataKuliah.sks,
    prodi: mataKuliah.prodi,
    jenis: mataKuliah.jenis,
    kelompok: mataKuliah.kelompok,
    tipe_kelas: mataKuliah.tipe_kelas,
    semester: mataKuliah.semester,
  };

  const sortColumn = sortMap[sortBy] || mataKuliah.id;
  const sortDir = String(order).toLowerCase() === "desc" ? desc(sortColumn) : asc(sortColumn);

  // Query data mata kuliah
  let query = db
    .select({
      id: mataKuliah.id,
      kode: mataKuliah.kode,
      nama: mataKuliah.nama,
      sks: mataKuliah.sks,
      prodi: mataKuliah.prodi,
      jenis: mataKuliah.jenis,
      kelompok: mataKuliah.kelompok,
      tipe_kelas: mataKuliah.tipe_kelas,
      semester: mataKuliah.semester,
    })
    .from(mataKuliah)
    .innerJoin(kurikulumMataKuliah, eq(mataKuliah.id, kurikulumMataKuliah.mata_kuliah_id))
    .where(whereClause)
    .orderBy(sortDir);

  const shouldPaginate = pagination.paginate !== false && pagination.limit !== "all";

  if (shouldPaginate) {
    const pageNum = Math.max(1, Number(pagination.page) || 1);
    const limitNum = Math.max(1, Number(pagination.limit) || 10);
    const offsetNum = (pageNum - 1) * limitNum;

    query = query.limit(limitNum).offset(offsetNum);

    const data = await query;
    const totalPages = Math.ceil(total / limitNum);

    return {
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  }

  const data = await query;
  return {
    data,
    pagination: {
      page: 1,
      limit: total,
      total,
      totalPages: total > 0 ? 1 : 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

export async function getAllMataKuliah(kurikulumId) {
  if (kurikulumId) {
    return await db
      .select({
        id: mataKuliah.id,
        kode: mataKuliah.kode,
        nama: mataKuliah.nama,
        sks: mataKuliah.sks,
        prodi: mataKuliah.prodi,
        jenis: mataKuliah.jenis,
        kelompok: mataKuliah.kelompok,
        tipe_kelas: mataKuliah.tipe_kelas,
        semester: mataKuliah.semester,
      })
      .from(mataKuliah)
      .innerJoin(kurikulumMataKuliah, eq(mataKuliah.id, kurikulumMataKuliah.mata_kuliah_id))
      .where(eq(kurikulumMataKuliah.kurikulum_id, kurikulumId));
  }
  return await db.select().from(mataKuliah);
}

export async function getMataKuliahById(id) {
  const result = await db.select().from(mataKuliah).where(eq(mataKuliah.id, id)).limit(1);
  return result[0] || null;
}

export async function createMataKuliah(data) {
  const result = await db.insert(mataKuliah).values(data).returning();
  return result[0];
}

export async function linkKurikulumMataKuliah(kurikulumId, mataKuliahId) {
  const result = await db
    .insert(kurikulumMataKuliah)
    .values({
      kurikulum_id: kurikulumId,
      mata_kuliah_id: mataKuliahId,
    })
    .returning();
  return result[0];
}

export async function updateMataKuliah(id, data) {
  const result = await db.update(mataKuliah).set(data).where(eq(mataKuliah.id, id)).returning();
  return result[0] || null;
}

export async function deleteMataKuliah(id) {
  const result = await db.delete(mataKuliah).where(eq(mataKuliah.id, id)).returning();
  return result[0] || null;
}

import { z, ZodError } from "zod";
import { isStartTimeEarlier } from "../utils/date-utils.js";

function handleZodError(error, next) {
  if (error instanceof ZodError) {
    const err = new Error(error.issues[0]?.message || "Validation Error");
    err.statusCode = 400;
    return next(err);
  }
  return next(error);
}

// Middleware validasi ID Parameter
export function idParamValidation(req, res, next) {
  const paramVal = req.params.id || req.params.kurikulumId;
  const id = Number(paramVal);
  if (!paramVal || isNaN(id) || !Number.isInteger(id) || id <= 0) {
    const err = new Error("Parameter ID harus berupa angka integer positif");
    err.statusCode = 400;
    return next(err);
  }
  next();
}

// Middleware validasi Kurikulum ID Parameter jika ada
export function kurikulumParamValidation(req, res, next) {
  if (req.params.kurikulumId !== undefined) {
    const id = Number(req.params.kurikulumId);
    if (!req.params.kurikulumId || isNaN(id) || !Number.isInteger(id) || id <= 0) {
      const err = new Error("Parameter kurikulum_id harus berupa angka integer positif");
      err.statusCode = 400;
      return next(err);
    }
  }
  next();
}

// === DOSEN ===
export const dosenSchema = z.object({
  nama: z.string().min(1, "Field nama tidak boleh kosong"),
  nidn: z.string().min(1, "Field nidn tidak boleh kosong"),
  jabatan_akademik: z.string().optional(),
  jabatanAkademik: z.string().optional(),
  kurikulum_id: z.coerce.number().int().positive().optional(),
  kurikulumId: z.coerce.number().int().positive().optional(),
}).refine(
  (data) => (data.jabatan_akademik && data.jabatan_akademik.trim().length > 0) ||
            (data.jabatanAkademik && data.jabatanAkademik.trim().length > 0),
  {
    message: "Field jabatan_akademik tidak boleh kosong",
    path: ["jabatan_akademik"],
  }
);

export function dosenValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }
    dosenSchema.parse(req.body);
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

// === KELAS ===
export const kelasSchema = z.object({
  prodi: z.enum(["TRI", "TRPL", "TRIK", "TRE"], {
    error: () => "Prodi harus salah satu dari: TRI, TRPL, TRIK, TRE",
  }),
  semester: z.coerce.number().int().min(1, "Semester harus berupa angka minimal 1"),
  kelas_teori: z.coerce.number().int().min(0, "kelas_teori harus berupa angka minimal 0").optional(),
  kelasTeori: z.coerce.number().int().min(0).optional(),
  kelas_praktikum: z.coerce.number().int().min(0, "kelas_praktikum harus berupa angka minimal 0").optional(),
  kelasPraktikum: z.coerce.number().int().min(0).optional(),
  jumlah_kelas: z.coerce.number().int().min(1).max(4).optional(),
  jumlahKelas: z.coerce.number().int().min(1).max(4).optional(),
  kelas: z.string().optional(),
  kode_kelas: z.string().optional(),
  kodeKelas: z.string().optional(),
  kurikulum_id: z.coerce.number().int().positive().optional(),
  kurikulumId: z.coerce.number().int().positive().optional(),
}).refine(
  (data) => {
    const hasTeori = data.kelas_teori !== undefined || data.kelasTeori !== undefined;
    const hasPraktikum = data.kelas_praktikum !== undefined || data.kelasPraktikum !== undefined;
    const hasJumlah = data.jumlah_kelas !== undefined || data.jumlahKelas !== undefined;
    if (hasTeori || hasPraktikum || hasJumlah) {
      return true;
    }
    return Boolean(
      data.kelas &&
      ((data.kode_kelas && data.kode_kelas.trim().length > 0) ||
       (data.kodeKelas && data.kodeKelas.trim().length > 0))
    );
  },
  {
    message: "Field kelas_teori dan kelas_praktikum wajib diisi",
    path: ["kelas_teori"],
  }
);

export function kelasValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }
    kelasSchema.parse(req.body);
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

export const updateKelasSchema = z.object({
  prodi: z.enum(["TRI", "TRPL", "TRIK", "TRE"], {
    error: () => "Prodi harus salah satu dari: TRI, TRPL, TRIK, TRE",
  }).optional(),
  semester: z.coerce.number().int().min(1, "Semester harus berupa angka minimal 1").optional(),
  kelas: z.string().min(1, "Field kelas tidak boleh kosong").optional(),
  kode_kelas: z.string().optional(),
  kodeKelas: z.string().optional(),
});

export function updateKelasValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }
    updateKelasSchema.parse(req.body);
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

// === KURIKULUM ===
export const kurikulumSchema = z.object({
  semester: z.enum(["Ganjil", "Genap"], {
    error: () => "Semester harus 'Ganjil' atau 'Genap'",
  }),
  tahun_ajaran: z.coerce.number().int().min(1900, "Tahun ajaran minimal 1900").max(2100, "Tahun ajaran maksimal 2100").optional(),
  tahun: z.coerce.number().int().min(1900, "Tahun ajaran minimal 1900").max(2100, "Tahun ajaran maksimal 2100").optional(),
  description: z.string().optional().nullable(),
  kurikulumId: z.coerce.number().int().positive().optional(),
  kurikulum_id: z.coerce.number().int().positive().optional(),
  copy: z.union([z.boolean(), z.string()]).optional(),
}).refine(
  (data) => data.tahun_ajaran !== undefined || data.tahun !== undefined,
  {
    message: "Field tahun_ajaran (atau tahun) berupa angka tahun wajib diisi",
    path: ["tahun_ajaran"],
  }
);

export function kurikulumValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }
    kurikulumSchema.parse(req.body);
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

// === MATA KULIAH ===
export const mataKuliahSchema = z.object({
  kode: z.coerce.number().int().min(1, "Field kode harus berupa angka integer positif"),
  nama: z.string().min(1, "Field nama tidak boleh kosong"),
  sks: z.coerce.number().int().min(1, "Field sks minimal 1").max(10, "Field sks maksimal 10"),
  prodi: z.enum(["TRPL", "TRI", "TRE", "TRIK"], {
    error: () => "Prodi harus salah satu dari: TRPL, TRI, TRE, TRIK",
  }),
  jenis: z.enum(["Wajib", "Pilihan"], {
    error: () => "Jenis harus 'Wajib' atau 'Pilihan'",
  }),
  kelompok: z.enum(["Teori", "Praktikum"], {
    error: () => "Kelompok harus 'Teori' atau 'Praktikum'",
  }),
  tipe_kelas: z.string().optional(),
  tipeKelas: z.string().optional(),
  semester: z.coerce.number().int().min(1, "Semester minimal 1"),
  kurikulum_id: z.coerce.number().int().positive().optional(),
  kurikulumId: z.coerce.number().int().positive().optional(),
}).refine(
  (data) => {
    const val = data.tipe_kelas || data.tipeKelas;
    return val === "MKK" || val === "MKDU";
  },
  {
    message: "Tipe kelas harus 'MKK' atau 'MKDU'",
    path: ["tipe_kelas"],
  }
);

export function mataKuliahValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }
    mataKuliahSchema.parse(req.body);
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

const emptyToUndefined = (val) =>
  val === undefined || val === null || (typeof val === "string" && val.trim() === "")
    ? undefined
    : val;

export const getMataKuliahQuerySchema = z.object({
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1, "Query page minimal 1").optional()),
  limit: z.preprocess(
    emptyToUndefined,
    z.union([
      z.literal("all"),
      z.coerce.number().int().min(1, "Query limit minimal 1"),
    ]).optional()
  ),
  search: z.preprocess(emptyToUndefined, z.string().optional()),
  q: z.preprocess(emptyToUndefined, z.string().optional()),
  prodi: z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? v.trim().toUpperCase() : emptyToUndefined(v)),
    z.enum(["TRPL", "TRI", "TRE", "TRIK"], {
      error: () => "Prodi harus salah satu dari: TRPL, TRI, TRE, TRIK",
    }).optional()
  ),
  semester: z.preprocess(
    (v) => {
      if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) return undefined;
      if (!isNaN(Number(v))) return Number(v);
      const s = String(v).trim().toLowerCase();
      if (s === "ganjil" || s === "genap") return s;
      return v;
    },
    z.union([
      z.number().int().min(1, { message: "Semester minimal 1" }),
      z.enum(["ganjil", "genap"], { error: () => "Semester harus berupa angka atau 'ganjil'/'genap'" }),
    ]).optional()
  ),
  jenis: z.preprocess(
    (v) => {
      if (typeof v !== "string" || v.trim() === "") return undefined;
      const lower = v.trim().toLowerCase();
      if (lower === "wajib") return "Wajib";
      if (lower === "pilihan") return "Pilihan";
      return v;
    },
    z.enum(["Wajib", "Pilihan"], {
      error: () => "Jenis harus 'Wajib' atau 'Pilihan'",
    }).optional()
  ),
  kelompok: z.preprocess(
    (v) => {
      if (typeof v !== "string" || v.trim() === "") return undefined;
      const lower = v.trim().toLowerCase();
      if (lower === "teori") return "Teori";
      if (lower === "praktikum") return "Praktikum";
      return v;
    },
    z.enum(["Teori", "Praktikum"], {
      error: () => "Kelompok harus 'Teori' atau 'Praktikum'",
    }).optional()
  ),
  tipe_kelas: z.preprocess(
    (v) => {
      if (typeof v !== "string" || v.trim() === "") return undefined;
      const upper = v.trim().toUpperCase();
      if (upper === "MKK" || upper === "MKDU") return upper;
      return v;
    },
    z.enum(["MKK", "MKDU"], {
      error: () => "Tipe kelas harus 'MKK' atau 'MKDU'",
    }).optional()
  ),
  tipeKelas: z.preprocess(
    (v) => {
      if (typeof v !== "string" || v.trim() === "") return undefined;
      const upper = v.trim().toUpperCase();
      if (upper === "MKK" || upper === "MKDU") return upper;
      return v;
    },
    z.enum(["MKK", "MKDU"], {
      error: () => "Tipe kelas harus 'MKK' atau 'MKDU'",
    }).optional()
  ),
  sks: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1, "Field sks minimal 1").max(10, "Field sks maksimal 10").optional()),
  kode: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1, "Field kode harus berupa angka positif").optional()),
  sortBy: z.preprocess(
    emptyToUndefined,
    z.enum(["id", "kode", "nama", "sks", "prodi", "jenis", "kelompok", "tipe_kelas", "semester"], {
      error: () => "sortBy harus salah satu dari: id, kode, nama, sks, prodi, jenis, kelompok, tipe_kelas, semester",
    }).optional()
  ),
  order: z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? v.trim().toLowerCase() : emptyToUndefined(v)),
    z.enum(["asc", "desc"], {
      error: () => "order harus 'asc' atau 'desc'",
    }).optional()
  ),
  paginate: z.preprocess(emptyToUndefined, z.union([z.boolean(), z.string()]).optional()),
  kurikulum_id: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
  kurikulumId: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
});

export function mataKuliahQueryValidation(req, res, next) {
  try {
    const validated = getMataKuliahQuerySchema.parse(req.query);
    req.validatedQuery = validated;
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}


// === RUANG ===
export const ruangSchema = z.object({
  nama: z.string().min(1, "Field nama ruang tidak boleh kosong"),
  kurikulum_id: z.coerce.number().int().positive().optional(),
  kurikulumId: z.coerce.number().int().positive().optional(),
});

export function ruangValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }
    ruangSchema.parse(req.body);
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

// === SESI ===
export const sesiSchema = z.object({
  nama: z.coerce.number().int().min(1, "Field nama sesi harus berupa angka"),
  jam_mulai: z.string().optional(),
  jamMulai: z.string().optional(),
  jam_akhir: z.string().optional(),
  jamAkhir: z.string().optional(),
  kurikulum_id: z.coerce.number().int().positive().optional(),
  kurikulumId: z.coerce.number().int().positive().optional(),
}).refine(
  (data) => {
    const start = data.jam_mulai || data.jamMulai;
    const end = data.jam_akhir || data.jamAkhir;
    if (!start || !end) return false;
    return isStartTimeEarlier(start, end);
  },
  {
    message: "jam_mulai tidak bisa lebih lama daripada jam_akhir",
    path: ["jam_mulai"],
  }
);

export function sesiValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }
    sesiSchema.parse(req.body);
    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

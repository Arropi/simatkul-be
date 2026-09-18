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
  const id = Number(req.params.id);
  if (!req.params.id || isNaN(id) || !Number.isInteger(id) || id <= 0) {
    const err = new Error("Parameter ID harus berupa angka integer positif");
    err.statusCode = 400;
    return next(err);
  }
  next();
}

// === DOSEN ===
export const dosenSchema = z.object({
  nama: z.string().min(1, "Field nama tidak boleh kosong"),
  nidn: z.string().min(1, "Field nidn tidak boleh kosong"),
  jabatan_akademik: z.string().optional(),
}).refine(
  (data) => (data.jabatan_akademik && data.jabatan_akademik.trim().length > 0),
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
  prodi: z.enum(["TRPL", "TRI", "TRE", "TRIK"], {
    error: () => "Prodi harus salah satu dari: TRPL, TRI, TRE, TRIK",
  }),
  semester: z.coerce.number().int().min(1, "Semester harus berupa angka minimal 1"),
  kelas: z.string().min(1, "Field kelas tidak boleh kosong"),
  kode_kelas: z.string().optional(),
  kodeKelas: z.string().optional(),
}).refine(
  (data) => (data.kode_kelas && data.kode_kelas.trim().length > 0) ||
            (data.kodeKelas && data.kodeKelas.trim().length > 0),
  {
    message: "Field kode_kelas tidak boleh kosong",
    path: ["kode_kelas"],
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

// === KURIKULUM ===
export const kurikulumSchema = z.object({
  semester: z.enum(["Ganjil", "Genap"], {
    error: () => "Semester harus 'Ganjil' atau 'Genap'",
  }),
  tahun_ajaran: z.coerce.number().int().min(1900, "Tahun ajaran minimal 1900").max(2100, "Tahun ajaran maksimal 2100").optional(),
  tahun: z.coerce.number().int().min(1900, "Tahun ajaran minimal 1900").max(2100, "Tahun ajaran maksimal 2100").optional(),
  description: z.string().optional().nullable(),
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

// === RUANG ===
export const ruangSchema = z.object({
  nama: z.string().min(1, "Field nama ruang tidak boleh kosong"),
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

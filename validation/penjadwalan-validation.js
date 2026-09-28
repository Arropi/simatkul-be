import { z, ZodError } from "zod";

function handleZodError(error, next) {
  if (error instanceof ZodError) {
    const err = new Error(error.issues[0]?.message || "Validation Error");
    err.statusCode = 400;
    return next(err);
  }
  return next(error);
}

export const HARI_ENUM = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export function kurikulumParamValidation(req, res, next) {
  const paramVal = req.params.kurikulumId;
  const id = Number(paramVal);
  if (!paramVal || isNaN(id) || !Number.isInteger(id) || id <= 0) {
    const err = new Error("Parameter kurikulum_id harus berupa angka integer positif");
    err.statusCode = 400;
    return next(err);
  }
  next();
}

export function penjadwalanIdParamValidation(req, res, next) {
  const paramVal = req.params.penjadwalan_id || req.params.id;
  const id = Number(paramVal);
  if (!paramVal || isNaN(id) || !Number.isInteger(id) || id <= 0) {
    const err = new Error("Parameter penjadwalan_id harus berupa angka integer positif");
    err.statusCode = 400;
    return next(err);
  }
  next();
}

export function normalizeIdArray(val) {
  if (val === undefined || val === null) return [];
  if (Array.isArray(val)) {
    return Array.from(new Set(val.map((item) => Number(item)).filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0)));
  }
  const n = Number(val);
  return !isNaN(n) && Number.isInteger(n) && n > 0 ? [n] : [];
}

export const penjadwalanSchema = z
  .object({
    kurikulum_id: z.coerce.number().int().min(1, "Field kurikulum_id harus berupa angka integer positif").optional(),
    matkul_id: z.coerce.number().int().min(1, "Field matkul_id harus berupa angka integer positif"),
    ruang_id: z.coerce.number().int().min(1, "Field ruang_id harus berupa angka integer positif"),
    kelas_id: z.coerce.number().int().min(1, "Field kelas_id harus berupa angka integer positif"),
    hari: z.enum(["Senin", "Selasa", "Rabu", "Kamis", "Jumat"], {
      error: () => "Field hari harus salah satu dari: Senin, Selasa, Rabu, Kamis, Jumat",
    }),
    sesi_ids: z.array(z.coerce.number().int().min(1)).optional(),
    dosen_ids: z.array(z.coerce.number().int().min(1)).optional(),
  })
  .refine(
    (data) => data.sesi_ids !== undefined && data.sesi_ids.length > 0,
    {
      message: "Field sesi_ids harus diisi minimal 1 sesi",
      path: ["sesi_ids"],
    }
  )
  .refine(
    (data) => data.dosen_ids !== undefined && data.dosen_ids.length > 0,
    {
      message: "Field dosen_id atau dosen_ids harus diisi minimal 1 dosen",
      path: ["dosen_id"],
    }
  );

export function penjadwalanValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }

    penjadwalanSchema.parse(req.body);

    const kurikulumId = req.params.kurikulumId || req.body.kurikulum_id
    if (kurikulumId !== undefined) {
      const parsedKId = Number(kurikulumId);
      if (!kurikulumId || isNaN(parsedKId) || !Number.isInteger(parsedKId) || parsedKId <= 0) {
        const err = new Error("Field kurikulum_id harus berupa angka integer positif");
        err.statusCode = 400;
        return next(err);
      }
    } else if (!req.params.penjadwalan_id && !req.params.id) {
      const err = new Error("Field kurikulum_id harus berupa angka integer positif");
      err.statusCode = 400;
      return next(err);
    }

    const sesiList = normalizeIdArray(req.body.sesi_ids);
    const dosenList = normalizeIdArray(req.body.dosen_ids);

    if (sesiList.length === 0) {
      const err = new Error("Field sesi_ids harus diisi minimal 1 sesi valid");
      err.statusCode = 400;
      return next(err);
    }
    if (dosenList.length === 0) {
      const err = new Error("Field dosen_ids harus diisi minimal 1 dosen valid");
      err.statusCode = 400;
      return next(err);
    }

    req.body.sesi_ids = sesiList;
    req.body.dosen_ids = dosenList;
    console.log('Aman Validate')

    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

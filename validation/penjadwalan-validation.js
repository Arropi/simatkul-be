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

export const penjadwalanSchema = z.object({
  kurikulum_id: z.coerce.number().int().min(1, "Field kurikulum_id harus berupa angka integer positif").optional(),
  matkul_id: z.coerce.number().int().min(1, "Field matkul_id harus berupa angka integer positif"),
  dosen_id: z.coerce.number().int().min(1, "Field dosen_id harus berupa angka integer positif"),
  ruang_id: z.coerce.number().int().min(1, "Field ruang_id harus berupa angka integer positif"),
  sesi_id: z.coerce.number().int().min(1, "Field sesi_id harus berupa angka integer positif"),
  kelas_id: z.coerce.number().int().min(1, "Field kelas_id harus berupa angka integer positif"),
  hari: z.enum(["Senin", "Selasa", "Rabu", "Kamis", "Jumat"], {
    error: () => "Field hari harus salah satu dari: Senin, Selasa, Rabu, Kamis, Jumat",
  }),
});

export function penjadwalanValidation(req, res, next) {
  try {
    if (!req.body || typeof req.body !== "object") {
      const err = new Error("Request body tidak boleh kosong");
      err.statusCode = 400;
      return next(err);
    }

    penjadwalanSchema.parse(req.body);

    const kurikulumId = req.params.kurikulumId || req.body.kurikulum_id || req.body.kurikulumId;
    const parsedKId = Number(kurikulumId);
    if (!kurikulumId || isNaN(parsedKId) || !Number.isInteger(parsedKId) || parsedKId <= 0) {
      const err = new Error("Field kurikulum_id harus berupa angka integer positif");
      err.statusCode = 400;
      return next(err);
    }

    next();
  } catch (error) {
    handleZodError(error, next);
  }
}

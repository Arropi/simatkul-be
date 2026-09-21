import * as mataKuliahRepo from "../../repositories/master-data/mata-kuliah-repository.js";
import * as kurikulumRepo from "../../repositories/master-data/kurikulum-repository.js";

export async function getAllMataKuliahService(kurikulumId) {
  const parsedKurikulumId = kurikulumId ? Number(kurikulumId) : undefined;
  return await mataKuliahRepo.getAllMataKuliah(parsedKurikulumId);
}

export async function getMataKuliahByKurikulumIdService(kurikulumId, query = {}) {
  const parsedKurikulumId = Number(kurikulumId);
  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id harus berupa angka integer positif");
    error.statusCode = 400;
    throw error;
  }

  const kurikulumData = await kurikulumRepo.getKurikulumById(parsedKurikulumId);
  if (!kurikulumData) {
    const error = new Error(`Data kurikulum dengan ID ${parsedKurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const {
    search,
    q,
    prodi,
    semester,
    jenis,
    kelompok,
    tipe_kelas,
    tipeKelas,
    sks,
    kode,
    page,
    limit,
    sortBy,
    order,
    paginate,
  } = query;

  const isPaginateFalse =
    paginate === false ||
    paginate === "false" ||
    limit === "all" ||
    limit === 0 ||
    limit === "0";

  const options = {
    search: search || q,
    filters: {
      prodi,
      semester,
      jenis,
      kelompok,
      tipe_kelas: tipe_kelas || tipeKelas,
      sks,
      kode,
    },
    pagination: {
      page: page !== undefined ? Number(page) : 1,
      limit: limit !== undefined && limit !== "all" ? Number(limit) : 10,
      paginate: !isPaginateFalse,
    },
    sortBy,
    order,
  };

  return await mataKuliahRepo.getMataKuliahByKurikulum(parsedKurikulumId, options);
}

export async function getMataKuliahByIdService(id) {
  const data = await mataKuliahRepo.getMataKuliahById(id);
  if (!data) {
    const error = new Error(`Data mata kuliah dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return data;
}

export async function createMataKuliahService(payload, kurikulumId) {
  const parsedKurikulumId = Number(
    kurikulumId ||
    payload.kurikulum_id ||
    payload.kurikulumId
  );

  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  // Validasi kurikulum di database
  const kurikulumData = await kurikulumRepo.getKurikulumById(parsedKurikulumId);
  if (!kurikulumData) {
    const error = new Error(`Data kurikulum dengan ID ${parsedKurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  // Validasi semester kurikulum jika ada
  if (kurikulumData.semester && payload.semester !== undefined) {
    const kurikulumSemester = kurikulumData.semester.trim().toLowerCase();
    const isKurikulumGanjil = kurikulumSemester.includes("ganjil");
    const isKurikulumGenap = kurikulumSemester.includes("genap");
    const inputSemester = Number(payload.semester);

    if (!isNaN(inputSemester) && inputSemester > 0) {
      const isInputGanjil = inputSemester % 2 !== 0;
      const isInputGenap = inputSemester % 2 === 0;

      if (isKurikulumGanjil && isInputGenap) {
        const error = new Error("Kurikulum semester ganjil tidak boleh memiliki mata kuliah dengan semester genap");
        error.statusCode = 400;
        throw error;
      }

      if (isKurikulumGenap && isInputGanjil) {
        const error = new Error("Kurikulum semester genap tidak boleh memiliki mata kuliah dengan semester ganjil");
        error.statusCode = 400;
        throw error;
      }
    }
  }

  const data = {
    kode: Number(payload.kode),
    nama: payload.nama.trim(),
    sks: Number(payload.sks),
    prodi: payload.prodi.trim(),
    jenis: payload.jenis.trim(),
    kelompok: payload.kelompok.trim(),
    tipe_kelas: (payload.tipe_kelas || payload.tipeKelas).trim(),
    semester: Number(payload.semester),
  };

  const created = await mataKuliahRepo.createMataKuliah(data);
  await mataKuliahRepo.linkKurikulumMataKuliah(parsedKurikulumId, created.id);
  return created;
}

export async function updateMataKuliahService(id, payload) {
  await getMataKuliahByIdService(id);

  const data = {};
  if (payload.kode !== undefined) data.kode = Number(payload.kode);
  if (payload.nama !== undefined) data.nama = payload.nama.trim();
  if (payload.sks !== undefined) data.sks = Number(payload.sks);
  if (payload.prodi !== undefined) data.prodi = payload.prodi.trim();
  if (payload.jenis !== undefined) data.jenis = payload.jenis.trim();
  if (payload.kelompok !== undefined) data.kelompok = payload.kelompok.trim();
  if (payload.tipe_kelas !== undefined || payload.tipeKelas !== undefined) {
    data.tipe_kelas = (payload.tipe_kelas || payload.tipeKelas).trim();
  }
  if (payload.semester !== undefined) data.semester = Number(payload.semester);

  return await mataKuliahRepo.updateMataKuliah(id, data);
}

export async function deleteMataKuliahService(id) {
  const deleted = await mataKuliahRepo.deleteMataKuliah(id);
  if (!deleted) {
    const error = new Error(`Data mata kuliah dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

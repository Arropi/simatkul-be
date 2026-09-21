import * as kurikulumRepo from "../../repositories/master-data/kurikulum-repository.js";
import { normalizeYearToDate } from "../../utils/date-utils.js";

export function formatKurikulumList(list) {
  const nameCounts = new Map();

  return list.map((item) => {
    const yearStr = String(item.tahun || "");
    const year = parseInt(yearStr.substring(0, 4), 10);
    const nextYear = isNaN(year) ? "" : year + 1;
    const baseName = isNaN(year)
      ? `${item.semester}`
      : `${item.semester} ${year}/${nextYear}`;

    const count = (nameCounts.get(baseName) || 0) + 1;
    nameCounts.set(baseName, count);

    const nama = count === 1 ? baseName : `${baseName} - ${count}`;

    return {
      id: item.id,
      nama,
      semester: item.semester,
      tahun: item.tahun,
      description: item.description,
      total_mata_kuliah: Number(item.total_mata_kuliah || 0),
      total_sesi: Number(item.total_sesi || 0),
      total_dosen: Number(item.total_dosen || 0),
      total_kelas: Number(item.total_kelas || 0),
      total_ruang: Number(item.total_ruang || 0),
    };
  });
}

export async function getAllKurikulumService() {
  const rawList = await kurikulumRepo.getAllKurikulum();
  return formatKurikulumList(rawList);
}

export async function getKurikulumByIdService(id) {
  const allFormatted = await getAllKurikulumService();
  const found = allFormatted.find((item) => item.id === id);

  if (!found) {
    const error = new Error(`Data kurikulum dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return found;
}

export async function createKurikulumService(payload, options = {}) {
  const rawYear = payload.tahun_ajaran !== undefined ? payload.tahun_ajaran : payload.tahun;
  const convertedTahun = normalizeYearToDate(rawYear);

  const isCopy = Boolean(
    options.copy === true ||
    options.copy === "true" ||
    options.copy === 1 ||
    options.copy === "1" ||
    payload.copy === true ||
    payload.copy === "true" ||
    payload.copy === 1 ||
    payload.copy === "1"
  );

  const sourceKurikulumId = Number(
    options.kurikulumId ||
    options.kurikulum_id ||
    payload.kurikulumId ||
    payload.kurikulum_id
  );

  if (isCopy) {
    if (!sourceKurikulumId || isNaN(sourceKurikulumId) || sourceKurikulumId <= 0) {
      const error = new Error("Parameter kurikulumId wajib diisi saat opsi copy aktif");
      error.statusCode = 400;
      throw error;
    }

    const sourceKurikulum = await kurikulumRepo.getKurikulumById(sourceKurikulumId);
    if (!sourceKurikulum) {
      const error = new Error(`Data kurikulum asal dengan ID ${sourceKurikulumId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
  }

  const data = {
    semester: payload.semester.trim(),
    tahun: convertedTahun,
    description: payload.description ? payload.description.trim() : null,
  };
  const created = await kurikulumRepo.createKurikulum(data);

  if (isCopy) {
    await kurikulumRepo.copyKurikulumRelations(sourceKurikulumId, created.id);
  }

  return await getKurikulumByIdService(created.id);
}

export async function updateKurikulumService(id, payload) {
  await getKurikulumByIdService(id);

  const data = {};
  if (payload.semester !== undefined) data.semester = payload.semester.trim();
  if (payload.tahun_ajaran !== undefined || payload.tahun !== undefined) {
    const rawYear = payload.tahun_ajaran !== undefined ? payload.tahun_ajaran : payload.tahun;
    data.tahun = normalizeYearToDate(rawYear);
  }
  if (payload.description !== undefined) {
    data.description = payload.description ? payload.description.trim() : null;
  }

  return await kurikulumRepo.updateKurikulum(id, data);
}

export async function deleteKurikulumService(id) {
  const deleted = await kurikulumRepo.deleteKurikulum(id);
  if (!deleted) {
    const error = new Error(`Data kurikulum dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

import * as sesiRepo from "../../repositories/master-data/sesi-repository.js";
import * as kurikulumRepo from "../../repositories/master-data/kurikulum-repository.js";
import { normalizeTimestamp, isStartTimeEarlier } from "../../utils/date-utils.js";

export async function getAllSesiService(kurikulumId) {
  const parsedKurikulumId = kurikulumId ? Number(kurikulumId) : undefined;
  const sesi = await sesiRepo.getAllSesi(parsedKurikulumId);
  const data = sesi.map((s, index) => {
    return {
      nama: "Sesi " + (index + 1),
      ...s,
    };
  });
  return data;
}

export async function getSesiByKurikulumIdService(kurikulumId) {
  const parsedKurikulumId = Number(kurikulumId);
  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id harus berupa angka integer positif");
    error.statusCode = 400;
    throw error;
  }
  const sesi = await sesiRepo.getAllSesi(parsedKurikulumId);
  const data = sesi.map((s, index) => {
    return {
      nama: "Sesi " + (index + 1),
      ...s,
    };
  });
  return data;
}

export async function getSesiByIdService(id) {
  const data = await sesiRepo.getSesiById(id);
  if (!data) {
    const error = new Error(`Data sesi dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return data;
}

export async function createSesiService(payload, kurikulumId) {
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

  const rawStart = payload.jam_mulai || payload.jamMulai;
  const rawEnd = payload.jam_akhir || payload.jamAkhir;

  // Validasi: jam_mulai tidak bisa lebih lama daripada jam_akhir
  if (!isStartTimeEarlier(rawStart, rawEnd)) {
    const error = new Error("jam_mulai tidak bisa lebih lama daripada jam_akhir");
    error.statusCode = 400;
    throw error;
  }

  const data = {
    nama: Number(payload.nama),
    jam_mulai: normalizeTimestamp(rawStart),
    jam_akhir: normalizeTimestamp(rawEnd),
  };

  const created = await sesiRepo.createSesi(data);
  await sesiRepo.linkKurikulumSesi(parsedKurikulumId, created.id);
  return created;
}

export async function updateSesiService(id, payload) {
  const existing = await getSesiByIdService(id);

  const rawStart = payload.jam_mulai !== undefined
    ? payload.jam_mulai
    : existing.jam_mulai;

  const rawEnd = payload.jam_akhir !== undefined
    ? payload.jam_akhir
    : existing.jam_akhir;

  // Validasi: jam_mulai tidak bisa lebih lama daripada jam_akhir
  if (!isStartTimeEarlier(rawStart, rawEnd)) {
    const error = new Error("jam_mulai tidak bisa lebih lama daripada jam_akhir");
    error.statusCode = 400;
    throw error;
  }

  const data = {};
  if (payload.nama !== undefined) data.nama = Number(payload.nama);
  if (payload.jam_mulai !== undefined) {
    data.jam_mulai = normalizeTimestamp(rawStart);
  }
  if (payload.jam_akhir !== undefined) {
    data.jam_akhir = normalizeTimestamp(rawEnd);
  }

  return await sesiRepo.updateSesi(id, data);
}

export async function deleteSesiService(id) {
  const deleted = await sesiRepo.deleteSesi(id);
  if (!deleted) {
    const error = new Error(`Data sesi dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

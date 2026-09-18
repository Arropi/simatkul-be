import * as sesiRepo from "../../repositories/master-data/sesi-repository.js";
import { normalizeTimestamp, isStartTimeEarlier } from "../../utils/date-utils.js";

export async function getAllSesiService() {
  return await sesiRepo.getAllSesi();
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

export async function createSesiService(payload) {
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

  return await sesiRepo.createSesi(data);
}

export async function updateSesiService(id, payload) {
  const existing = await getSesiByIdService(id);

  const rawStart = payload.jam_mulai !== undefined || payload.jamMulai !== undefined
    ? (payload.jam_mulai || payload.jamMulai)
    : existing.jam_mulai;

  const rawEnd = payload.jam_akhir !== undefined || payload.jamAkhir !== undefined
    ? (payload.jam_akhir || payload.jamAkhir)
    : existing.jam_akhir;

  // Validasi: jam_mulai tidak bisa lebih lama daripada jam_akhir
  if (!isStartTimeEarlier(rawStart, rawEnd)) {
    const error = new Error("jam_mulai tidak bisa lebih lama daripada jam_akhir");
    error.statusCode = 400;
    throw error;
  }

  const data = {};
  if (payload.nama !== undefined) data.nama = Number(payload.nama);
  if (payload.jam_mulai !== undefined || payload.jamMulai !== undefined) {
    data.jam_mulai = normalizeTimestamp(rawStart);
  }
  if (payload.jam_akhir !== undefined || payload.jamAkhir !== undefined) {
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

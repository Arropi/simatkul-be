import * as ruangRepo from "../../repositories/master-data/ruang-repository.js";

export async function getAllRuangService() {
  return await ruangRepo.getAllRuang();
}

export async function getRuangByIdService(id) {
  const data = await ruangRepo.getRuangById(id);
  if (!data) {
    const error = new Error(`Data ruang dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return data;
}

export async function createRuangService(payload) {
  const data = {
    nama: payload.nama.trim(),
  };
  return await ruangRepo.createRuang(data);
}

export async function updateRuangService(id, payload) {
  await getRuangByIdService(id);

  const data = {};
  if (payload.nama !== undefined) data.nama = payload.nama.trim();

  return await ruangRepo.updateRuang(id, data);
}

export async function deleteRuangService(id) {
  const deleted = await ruangRepo.deleteRuang(id);
  if (!deleted) {
    const error = new Error(`Data ruang dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

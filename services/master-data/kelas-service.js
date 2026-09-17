import * as kelasRepo from "../../repositories/master-data/kelas-repository.js";

export async function getAllKelasService() {
  return await kelasRepo.getAllKelas();
}

export async function getKelasByIdService(id) {
  const data = await kelasRepo.getKelasById(id);
  if (!data) {
    const error = new Error(`Data kelas dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return data;
}

export async function createKelasService(payload) {
  const data = {
    prodi: payload.prodi.trim(),
    semester: Number(payload.semester),
    kelas: payload.kelas.trim(),
    kode_kelas: (payload.kode_kelas || payload.kodeKelas).trim(),
  };
  return await kelasRepo.createKelas(data);
}

export async function updateKelasService(id, payload) {
  await getKelasByIdService(id);

  const data = {};
  if (payload.prodi !== undefined) data.prodi = payload.prodi.trim();
  if (payload.semester !== undefined) data.semester = Number(payload.semester);
  if (payload.kelas !== undefined) data.kelas = payload.kelas.trim();
  if (payload.kode_kelas !== undefined || payload.kodeKelas !== undefined) {
    data.kode_kelas = (payload.kode_kelas || payload.kodeKelas).trim();
  }

  return await kelasRepo.updateKelas(id, data);
}

export async function deleteKelasService(id) {
  const deleted = await kelasRepo.deleteKelas(id);
  if (!deleted) {
    const error = new Error(`Data kelas dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

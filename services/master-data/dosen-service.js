import * as dosenRepo from "../../repositories/master-data/dosen-repository.js";

export async function getAllDosenService() {
  return await dosenRepo.getAllDosen();
}

export async function getDosenByIdService(id) {
  const data = await dosenRepo.getDosenById(id);
  if (!data) {
    const error = new Error(`Data dosen dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return data;
}

export async function createDosenService(payload) {
  const data = {
    nama: payload.nama.trim(),
    nidn: payload.nidn.trim(),
    jabatan_akademik: (payload.jabatan_akademik || payload.jabatanAkademik).trim(),
  };
  return await dosenRepo.createDosen(data);
}

export async function updateDosenService(id, payload) {
  // Pastikan data ada terlebih dahulu
  await getDosenByIdService(id);

  const data = {};
  if (payload.nama !== undefined) data.nama = payload.nama.trim();
  if (payload.nidn !== undefined) data.nidn = payload.nidn.trim();
  if (payload.jabatan_akademik !== undefined || payload.jabatanAkademik !== undefined) {
    data.jabatan_akademik = (payload.jabatan_akademik || payload.jabatanAkademik).trim();
  }

  return await dosenRepo.updateDosen(id, data);
}

export async function deleteDosenService(id) {
  const deleted = await dosenRepo.deleteDosen(id);
  if (!deleted) {
    const error = new Error(`Data dosen dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}

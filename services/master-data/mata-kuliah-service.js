import * as mataKuliahRepo from "../../repositories/master-data/mata-kuliah-repository.js";

export async function getAllMataKuliahService() {
  return await mataKuliahRepo.getAllMataKuliah();
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

export async function createMataKuliahService(payload) {
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
  return await mataKuliahRepo.createMataKuliah(data);
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

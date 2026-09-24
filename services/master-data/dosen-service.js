import * as dosenRepo from "../../repositories/master-data/dosen-repository.js";
import * as kurikulumRepo from "../../repositories/master-data/kurikulum-repository.js";

export async function getAllDosenService(kurikulumId) {
  const parsedKurikulumId = kurikulumId ? Number(kurikulumId) : undefined;
  return await dosenRepo.getAllDosen(parsedKurikulumId);
}

export async function getDosenByKurikulumIdService(kurikulumId) {
  const parsedKurikulumId = Number(kurikulumId);

  return await dosenRepo.getAllDosen(parsedKurikulumId);
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

export async function createDosenService(payload, kurikulumId) {
  const parsedKurikulumId = Number(kurikulumId);

  // Validasi kurikulum di database
  const kurikulumData = await kurikulumRepo.getKurikulumById(parsedKurikulumId);
  if (!kurikulumData) {
    const error = new Error(`Data kurikulum dengan ID ${parsedKurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const data = {
    nama: payload.nama.trim()
  };

  const created = await dosenRepo.createDosen(data);
  await dosenRepo.linkKurikulumDosen(parsedKurikulumId, created.id);
  return created;
}

export async function updateDosenService(id, payload) {
  // Pastikan data ada terlebih dahulu
  await getDosenByIdService(id);

  const data = {};
  if (payload.nama !== undefined) data.nama = payload.nama.trim();
  if (payload.nidn !== undefined) data.nidn = payload.nidn.trim();
  if (payload.jabatan_akademik !== undefined) {
    data.jabatan_akademik = (payload.jabatan_akademik).trim();
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

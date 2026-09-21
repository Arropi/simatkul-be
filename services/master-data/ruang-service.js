import * as ruangRepo from "../../repositories/master-data/ruang-repository.js";
import * as kurikulumRepo from "../../repositories/master-data/kurikulum-repository.js";

export async function getAllRuangService(kurikulumId) {
  const parsedKurikulumId = kurikulumId ? Number(kurikulumId) : undefined;
  return await ruangRepo.getAllRuang(parsedKurikulumId);
}

export async function getRuangByKurikulumIdService(kurikulumId) {
  const parsedKurikulumId = Number(kurikulumId);
  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id harus berupa angka integer positif");
    error.statusCode = 400;
    throw error;
  }
  return await ruangRepo.getAllRuang(parsedKurikulumId);
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

export async function createRuangService(payload, kurikulumId) {
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

  const data = {
    nama: payload.nama.trim(),
  };

  const created = await ruangRepo.createRuang(data);
  await ruangRepo.linkKurikulumRuang(parsedKurikulumId, created.id);
  return created;
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

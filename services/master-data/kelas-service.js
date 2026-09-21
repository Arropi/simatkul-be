import * as kelasRepo from "../../repositories/master-data/kelas-repository.js";
import * as kurikulumRepo from "../../repositories/master-data/kurikulum-repository.js";

export function getNamaKelasList(jumlahKelas) {
  switch (jumlahKelas) {
    case 1:
      return ["AB"];
    case 2:
      return ["AA", "BB"];
    case 3:
      return ["AA", "BB", "AB"];
    case 4:
      return ["A1", "A2", "B1", "B2"];
    default:
      return null;
  }
}

export async function getAllKelasService(kurikulumId) {
  const parsedKurikulumId = kurikulumId ? Number(kurikulumId) : undefined;
  return await kelasRepo.getAllKelas(parsedKurikulumId);
}

export async function getKelasByKurikulumIdService(kurikulumId) {
  const parsedKurikulumId = Number(kurikulumId);
  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id harus berupa angka integer positif");
    error.statusCode = 400;
    throw error;
  }
  return await kelasRepo.getAllKelas(parsedKurikulumId);
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

export async function createKelasService(payload, kurikulumId) {
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

  // 1. Cek data kurikulum di database
  const kurikulumData = await kurikulumRepo.getKurikulumById(parsedKurikulumId);
  if (!kurikulumData) {
    const error = new Error(`Data kurikulum dengan ID ${parsedKurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Validasinya cek di file service semester ada ngga
  if (!kurikulumData.semester) {
    const error = new Error("Data semester pada kurikulum tidak ditemukan");
    error.statusCode = 400;
    throw error;
  }

  // 3. Kalau ada cek lagi kalau ganjil ga boleh semester yang genap begitupun sebaliknya
  const kurikulumSemester = kurikulumData.semester.trim().toLowerCase();
  const isKurikulumGanjil = kurikulumSemester.includes("ganjil");
  const isKurikulumGenap = kurikulumSemester.includes("genap");

  const inputSemester = Number(payload.semester);
  if (isNaN(inputSemester) || inputSemester <= 0) {
    const error = new Error("Semester harus berupa angka positif minimal 1");
    error.statusCode = 400;
    throw error;
  }

  const isInputGanjil = inputSemester % 2 !== 0;
  const isInputGenap = inputSemester % 2 === 0;

  if (isKurikulumGanjil && isInputGenap) {
    const error = new Error("Kurikulum semester ganjil tidak boleh memiliki kelas dengan semester genap");
    error.statusCode = 400;
    throw error;
  }

  if (isKurikulumGenap && isInputGanjil) {
    const error = new Error("Kurikulum semester genap tidak boleh memiliki kelas dengan semester ganjil");
    error.statusCode = 400;
    throw error;
  }

  const praktikum = Number(payload.kelas_praktikum ?? payload.kelasPraktikum ?? 0);
  const teori = Number(payload.kelas_teori ?? payload.kelasTeori ?? 0);
  const jumlahExplicit = (payload.jumlah_kelas !== undefined || payload.jumlahKelas !== undefined)
    ? Number(payload.jumlah_kelas ?? payload.jumlahKelas)
    : undefined;

  // Mendukung payload format lama jika dikirim secara eksplisit kelas & kode_kelas
  if (
    jumlahExplicit === undefined &&
    praktikum === 0 &&
    teori === 0 &&
    payload.kelas &&
    (payload.kode_kelas || payload.kodeKelas)
  ) {
    const data = {
      prodi: payload.prodi.trim(),
      semester: inputSemester,
      kelas: payload.kelas.trim(),
      kode_kelas: (payload.kode_kelas || payload.kodeKelas).trim(),
    };
    const created = await kelasRepo.createKelas(data);
    await kelasRepo.linkKurikulumKelas(parsedKurikulumId, created.id);
    return created;
  }

  // Menentukan jumlah kelas:
  // 1. Jika eksplisit jumlah_kelas diisi, gunakan itu
  // 2. Jika kelas_praktikum > 0, gunakan kelas_praktikum
  // 3. Jika hanya kelas_teori yang diisi, gunakan kelas_teori
  // 4. Jika keduanya diisi, praktikum diprioritaskan atau max dari keduanya
  let jumlahKelas = jumlahExplicit !== undefined
    ? jumlahExplicit
    : (praktikum > 0 ? praktikum : (teori > 0 ? teori : Math.max(praktikum, teori)));

  const namaKelasList = getNamaKelasList(jumlahKelas);
  if (!namaKelasList) {
    const error = new Error(`Jumlah kelas ${jumlahKelas} tidak valid. Jumlah kelas yang didukung adalah 1, 2, 3, atau 4`);
    error.statusCode = 400;
    throw error;
  }

  const prodi = payload.prodi.trim();
  const createdList = [];

  for (const namaKelas of namaKelasList) {
    const data = {
      prodi,
      semester: inputSemester,
      kelas: namaKelas,
      kode_kelas: namaKelas,
    };
    const created = await kelasRepo.createKelas(data);
    await kelasRepo.linkKurikulumKelas(parsedKurikulumId, created.id);
    createdList.push(created);
  }

  return createdList;
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

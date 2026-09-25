import * as kelasRepo from "../../repositories/master-data/kelas-repository.js";
import * as kurikulumRepo from "../../repositories/master-data/kurikulum-repository.js";

export const PRODI_ABBR = {
  TRPL: "PL",
  TRIK: "IK",
  TRI: "RI",
  TRE: "RE",
};

export function getNamaKelasList(jumlahKelas) {
  switch (jumlahKelas) {
    case 0:
      return [];
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

export function generateKelasItems(prodi, semester, kelasTeori, kelasPraktikum) {
  const teori = Number(kelasTeori || 0);
  const praktikum = Number(kelasPraktikum || 0);

  if (teori <= 0 && praktikum <= 0) {
    const error = new Error("Minimal salah satu dari kelas_teori atau kelas_praktikum harus lebih dari 0");
    error.statusCode = 400;
    throw error;
  }

  const prodiUpper = prodi.trim().toUpperCase();
  const abbr = PRODI_ABBR[prodiUpper] || prodiUpper;

  const items = [];

  if (teori > 0) {
    const namaTeoriList = getNamaKelasList(teori);
    if (!namaTeoriList) {
      const error = new Error(`Jumlah kelas teori ${teori} tidak valid. Jumlah kelas yang didukung adalah 1, 2, 3, atau 4`);
      error.statusCode = 400;
      throw error;
    }
    for (const namaKelas of namaTeoriList) {
      items.push({
        prodi: prodiUpper,
        semester,
        kelas: namaKelas,
        kode_kelas: `${abbr}${semester}${namaKelas}`,
      });
    }
  }

  if (praktikum > 0) {
    const namaPraktikumList = getNamaKelasList(praktikum);
    if (!namaPraktikumList) {
      const error = new Error(`Jumlah kelas praktikum ${praktikum} tidak valid. Jumlah kelas yang didukung adalah 1, 2, 3, atau 4`);
      error.statusCode = 400;
      throw error;
    }
    for (const namaKelas of namaPraktikumList) {
      items.push({
        prodi: prodiUpper,
        semester,
        kelas: namaKelas,
        kode_kelas: `${abbr}${semester}${namaKelas}`,
      });
    }
  }

  return items;
}

export async function getAllKelasService() {
  return await kelasRepo.getAllKelas();
}

export async function getKelasByKurikulumIdService(kurikulumId) {
  const parsedKurikulumId = Number(kurikulumId);
  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id harus berupa angka integer positif");
    error.statusCode = 400;
    throw error;
  }
  return await kelasRepo.getAllKelasByKurikulum(parsedKurikulumId);
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
  const parsedKurikulumId = Number(kurikulumId);

  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const kurikulumData = await kurikulumRepo.getKurikulumById(parsedKurikulumId);
  if (!kurikulumData) {
    const error = new Error(`Data kurikulum dengan ID ${parsedKurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

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

  const isSemesterExist = await kelasRepo.getKelasByKurikulumAndSemester(parsedKurikulumId, inputSemester);
  if (isSemesterExist) {
    const error = new Error(`Kurikulum dengan ID ${parsedKurikulumId} sudah memiliki kelas dengan semester ${inputSemester}`);
    error.statusCode = 400;
    throw error;
  }

  const items = generateKelasItems(
    payload.prodi,
    inputSemester,
    payload.kelas_teori,
    payload.kelas_praktikum
  );

  const createdClasses = await kelasRepo.createKelasBatch(items);
  const links = createdClasses.map((c) => ({
    kurikulum_id: parsedKurikulumId,
    kelas_id: c.id,
  }));
  await kelasRepo.linkKurikulumKelasBatch(links);

  return createdClasses;
}

export async function updateKelasService(kurikulumId, payload) {
  const parsedKurikulumId = Number(kurikulumId);

  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const kurikulumData = await kurikulumRepo.getKurikulumById(parsedKurikulumId);
  if (!kurikulumData) {
    const error = new Error(`Data kurikulum dengan ID ${parsedKurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const fromSemester = Number(payload.from_semester);
  const toSemester = Number(payload.to_semester);

  if (isNaN(fromSemester) || fromSemester <= 0) {
    const error = new Error("from_semester harus berupa angka positif minimal 1");
    error.statusCode = 400;
    throw error;
  }

  if (isNaN(toSemester) || toSemester <= 0) {
    const error = new Error("to_semester harus berupa angka positif minimal 1");
    error.statusCode = 400;
    throw error;
  }

  const kurikulumSemester = kurikulumData.semester.trim().toLowerCase();
  const isKurikulumGanjil = kurikulumSemester.includes("ganjil");
  const isKurikulumGenap = kurikulumSemester.includes("genap");

  const isFromGanjil = fromSemester % 2 !== 0;
  const isFromGenap = fromSemester % 2 === 0;

  if (isKurikulumGanjil && isFromGenap) {
    const error = new Error("Kurikulum semester ganjil tidak boleh memiliki kelas dengan semester genap");
    error.statusCode = 400;
    throw error;
  }

  if (isKurikulumGenap && isFromGanjil) {
    const error = new Error("Kurikulum semester genap tidak boleh memiliki kelas dengan semester ganjil");
    error.statusCode = 400;
    throw error;
  }

  const isToGanjil = toSemester % 2 !== 0;
  const isToGenap = toSemester % 2 === 0;

  if (isKurikulumGanjil && isToGenap) {
    const error = new Error("Kurikulum semester ganjil tidak boleh memiliki kelas dengan semester genap");
    error.statusCode = 400;
    throw error;
  }

  if (isKurikulumGenap && isToGanjil) {
    const error = new Error("Kurikulum semester genap tidak boleh memiliki kelas dengan semester ganjil");
    error.statusCode = 400;
    throw error;
  }

  const existing = await kelasRepo.getKelasByKurikulumAndSemester(parsedKurikulumId, fromSemester);
  if (!existing || existing.length === 0) {
    const error = new Error(`Data kelas untuk kurikulum ID ${parsedKurikulumId} dan semester ${fromSemester} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const prodi = payload.prodi ? payload.prodi.trim() : existing[0].prodi;

  const items = generateKelasItems(
    prodi,
    toSemester,
    payload.kelas_teori,
    payload.kelas_praktikum
  );

  // Hapus semua kelas lama yang terbuat pada fromSemester
  await kelasRepo.deleteKelasByKurikulumAndSemester(parsedKurikulumId, fromSemester);

  // Jika toSemester berbeda dengan fromSemester, pastikan toSemester juga bersih
  if (toSemester !== fromSemester) {
    await kelasRepo.deleteKelasByKurikulumAndSemester(parsedKurikulumId, toSemester);
  }

  // Buat kelas baru sesuai konfigurasi pada toSemester
  const createdClasses = await kelasRepo.createKelasBatch(items);
  const links = createdClasses.map((c) => ({
    kurikulum_id: parsedKurikulumId,
    kelas_id: c.id,
  }));
  await kelasRepo.linkKurikulumKelasBatch(links);

  return createdClasses;
}

export async function deleteKelasService(kurikulumId, semester) {
  const parsedKurikulumId = Number(kurikulumId);
  const parsedSemester = Number(semester);

  if (!parsedKurikulumId || isNaN(parsedKurikulumId) || parsedKurikulumId <= 0) {
    const error = new Error("Parameter kurikulum_id harus berupa angka integer positif");
    error.statusCode = 400;
    throw error;
  }

  if (!parsedSemester || isNaN(parsedSemester) || parsedSemester <= 0) {
    const error = new Error("Parameter semester harus berupa angka integer positif");
    error.statusCode = 400;
    throw error;
  }

  const deleted = await kelasRepo.deleteKelasByKurikulumAndSemester(parsedKurikulumId, parsedSemester);
  if (!deleted || deleted.length === 0) {
    const error = new Error(`Data kelas untuk kurikulum ID ${parsedKurikulumId} dan semester ${parsedSemester} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  return deleted;
}


import * as masterDataRepo from "../../repositories/penjadwalan/master-data-repositories.js";
import * as penjadwalanRepo from "../../repositories/penjadwalan/penjadwalan-repository.js";

/**
 * Memeriksa apakah dua kelas mengalami bentrok jadwal (khususnya teori vs praktikum)
 * dalam prodi dan semester yang sama.
 *
 * Aturan:
 * - Jika beda prodi atau beda semester: tidak bentrok.
 * - Jika kelas sama persis (misal AA vs AA, A1 vs A1): bentrok.
 * - Group A: AA bentrok dengan A1 & A2 (dan sebaliknya). Namun A1 dan A2 TIDAK bentrok satu sama lain.
 * - Group B: BB bentrok dengan B1 & B2 (dan sebaliknya). Namun B1 dan B2 TIDAK bentrok satu sama lain.
 * - Kelas gabungan AB bentrok dengan semua kelas dalam cohort (prodi & semester) yang sama.
 */
export function isKelasConflict(k1, k2) {
  if (!k1 || !k2) return false;
  if (k1.id && k2.id && Number(k1.id) === Number(k2.id)) return true;

  // Jika prodi dan semester tersedia pada objek
  if (k1.prodi && k2.prodi && k1.semester !== undefined && k2.semester !== undefined) {
    if (k1.prodi !== k2.prodi || Number(k1.semester) !== Number(k2.semester)) {
      return false;
    }
    const s1 = (k1.kelas || k1.kode_kelas?.slice(-2) || "").toUpperCase();
    const s2 = (k2.kelas || k2.kode_kelas?.slice(-2) || "").toUpperCase();
    return checkSuffixConflict(s1, s2);
  }

  // Fallback berdasarkan kode_kelas jika prodi/semester tidak ada
  return isKodeKelasConflict(k1.kode_kelas || k1, k2.kode_kelas || k2);
}

export function isKodeKelasConflict(kode1, kode2) {
  if (!kode1 || !kode2) return false;
  if (kode1 === kode2) return true;

  if (kode1.length < 3 || kode2.length < 3) {
    return kode1 === kode2;
  }

  const prefix1 = kode1.slice(0, -2);
  const suffix1 = kode1.slice(-2).toUpperCase();

  const prefix2 = kode2.slice(0, -2);
  const suffix2 = kode2.slice(-2).toUpperCase();

  // Beda prodi / semester tidak bentrok
  if (prefix1 !== prefix2) {
    return false;
  }

  return checkSuffixConflict(suffix1, suffix2);
}

function checkSuffixConflict(s1, s2) {
  if (!s1 || !s2) return false;
  if (s1 === s2) return true;

  // Aturan Grup A
  const isATheory = s1 === "AA";
  const isAPractice = s1 === "A1" || s1 === "A2";
  const isOtherATheory = s2 === "AA";
  const isOtherAPractice = s2 === "A1" || s2 === "A2";

  if (isATheory && isOtherAPractice) return true;
  if (isAPractice && isOtherATheory) return true;

  // Aturan Grup B
  const isBTheory = s1 === "BB";
  const isBPractice = s1 === "B1" || s1 === "B2";
  const isOtherBTheory = s2 === "BB";
  const isOtherBPractice = s2 === "B1" || s2 === "B2";

  if (isBTheory && isOtherBPractice) return true;
  if (isBPractice && isOtherBTheory) return true;

  // Kelas Gabungan AB
  if (s1 === "AB" || s2 === "AB") return true;

  return false;
}

export async function getFormOptionsService(kurikulumId) {
  const exists = await masterDataRepo.checkKurikulumExists(kurikulumId);
  if (!exists) {
    const error = new Error(`Data kurikulum dengan ID ${kurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const [ruang, dosen, rawSesi, kelas, mataKuliah] = await Promise.all([
    masterDataRepo.getRuangByKurikulumId(kurikulumId),
    masterDataRepo.getDosenByKurikulumId(kurikulumId),
    masterDataRepo.getSesiByKurikulumId(kurikulumId),
    masterDataRepo.getKelasByKurikulumId(kurikulumId),
    masterDataRepo.getMataKuliahByKurikulumId(kurikulumId),
  ]);

  const sesi = rawSesi.map((item, idx) => ({
    id: item.id,
    nama: `Sesi ${idx + 1}`,
  }));

  return {
    ruang,
    dosen,
    sesi,
    kelas,
    mata_kuliah: mataKuliah,
  };
}

export async function createPenjadwalanService(payload, kurikulumIdParam) {
  const kurikulumId = Number(kurikulumIdParam || payload.kurikulum_id || payload.kurikulumId);
  const matkulId = Number(payload.matkul_id);
  const dosenId = Number(payload.dosen_id);
  const ruangId = Number(payload.ruang_id);
  const sesiId = Number(payload.sesi_id);
  const kelasId = Number(payload.kelas_id);
  const hari = payload.hari?.trim();

  // 1. Validasi keberadaan kurikulum
  const kurikulumExists = await masterDataRepo.checkKurikulumExists(kurikulumId);
  if (!kurikulumExists) {
    const error = new Error(`Data kurikulum dengan ID ${kurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Validasi keterkaitan entitas master-data ke kurikulum
  const targetKelas = await masterDataRepo.getKelasByIdAndKurikulum(kelasId, kurikulumId);
  if (!targetKelas) {
    const baseKelas = await masterDataRepo.getBaseKelasById(kelasId);
    if (!baseKelas) {
      const error = new Error(`Data kelas dengan ID ${kelasId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
    const error = new Error(`Data kelas dengan ID ${kelasId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  const targetMatkul = await masterDataRepo.getMataKuliahByIdAndKurikulum(matkulId, kurikulumId);
  if (!targetMatkul) {
    const baseMatkul = await masterDataRepo.getBaseMataKuliahById(matkulId);
    if (!baseMatkul) {
      const error = new Error(`Data mata kuliah dengan ID ${matkulId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
    const error = new Error(`Data mata kuliah dengan ID ${matkulId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  const targetDosen = await masterDataRepo.getDosenByIdAndKurikulum(dosenId, kurikulumId);
  if (!targetDosen) {
    const baseDosen = await masterDataRepo.getBaseDosenById(dosenId);
    if (!baseDosen) {
      const error = new Error(`Data dosen dengan ID ${dosenId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
    const error = new Error(`Data dosen dengan ID ${dosenId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  const targetRuang = await masterDataRepo.getRuangByIdAndKurikulum(ruangId, kurikulumId);
  if (!targetRuang) {
    const baseRuang = await masterDataRepo.getBaseRuangById(ruangId);
    if (!baseRuang) {
      const error = new Error(`Data ruang dengan ID ${ruangId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
    const error = new Error(`Data ruang dengan ID ${ruangId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  const targetSesi = await masterDataRepo.getSesiByIdAndKurikulum(sesiId, kurikulumId);
  if (!targetSesi) {
    const baseSesi = await masterDataRepo.getBaseSesiById(sesiId);
    if (!baseSesi) {
      const error = new Error(`Data sesi dengan ID ${sesiId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
    const error = new Error(`Data sesi dengan ID ${sesiId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  // 3. Ambil seluruh jadwal yang sudah ada pada slot (kurikulum_id, sesi_id, hari)
  const existingSchedules = await penjadwalanRepo.getExistingSchedulesBySlot(
    kurikulumId,
    sesiId,
    hari
  );

  // 4. Pengecekan bentrok berurutan sesuai spesifikasi:
  // Step 4.1: Cek apakah kelas tersebut sudah digunakan pada sesi dan hari tersebut
  const kelasUsed = existingSchedules.find((s) => Number(s.kelas_id) === kelasId);
  if (kelasUsed) {
    const error = new Error(
      `Kelas ${targetKelas.kode_kelas} sudah memiliki jadwal pada hari ${hari} dan sesi yang dipilih`
    );
    error.statusCode = 400;
    throw error;
  }

  // Step 4.2: Cek apakah terdapat bentrok ruang sudah dipakai
  const ruangUsed = existingSchedules.find((s) => Number(s.ruang_id) === ruangId);
  if (ruangUsed) {
    const error = new Error(
      `Ruang '${targetRuang.nama}' sudah digunakan pada hari ${hari} dan sesi yang dipilih`
    );
    error.statusCode = 400;
    throw error;
  }

  // Step 4.3: Cek apakah dosen pada sesi dan hari tersebut sudah ada jadwal
  const dosenUsed = existingSchedules.find((s) => Number(s.dosen_id) === dosenId);
  if (dosenUsed) {
    const error = new Error(
      `Dosen '${targetDosen.nama}' sudah memiliki jadwal mengajar pada hari ${hari} dan sesi yang dipilih`
    );
    error.statusCode = 400;
    throw error;
  }

  // Step 4.4: Pengecekan bentrok kelas kompleks (misal PL4AA vs PL4A1/PL4A2, PL4BB vs PL4B1/PL4B2)
  for (const existing of existingSchedules) {
    if (isKelasConflict(targetKelas, existing)) {
      const error = new Error(
        `Kelas ${targetKelas.kode_kelas} bentrok dengan jadwal kelas ${existing.kode_kelas} pada hari ${hari} dan sesi yang dipilih`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  // 5. Simpan ke tabel penjadwalan
  const created = await penjadwalanRepo.createPenjadwalan({
    kurikulum_id: kurikulumId,
    matkul_id: matkulId,
    dosen_id: dosenId,
    ruang_id: ruangId,
    sesi_id: sesiId,
    kelas_id: kelasId,
    hari,
  });

  return await penjadwalanRepo.getPenjadwalanById(created.id);
}

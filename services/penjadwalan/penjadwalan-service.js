import * as masterDataRepo from "../../repositories/penjadwalan/master-data-repositories.js";
import * as penjadwalanRepo from "../../repositories/penjadwalan/penjadwalan-repository.js";

export function isKelasConflict(k1, k2) {
  if (!k1 || !k2) return false;
  if (k1.id && k2.id && Number(k1.id) === Number(k2.kelas_id || k2.id)) return true;

  // Jika prodi dan semester berbeda langsung return false
  if (k1.prodi && k2.prodi && k1.prodi !== k2.prodi) return false;
  if (k1.semester && k2.semester && Number(k1.semester) !== Number(k2.semester)) return false;

  // Fallback berdasarkan kode_kelas jika prodi dan semester sudah sama
  const kode1 = k1.kode_kelas || (typeof k1 === "string" ? k1 : "");
  const kode2 = k2.kode_kelas || (typeof k2 === "string" ? k2 : "");
  const suffix1 = (k1.suffix || (kode1.length >= 2 ? kode1.slice(-2) : "")).toUpperCase();
  const suffix2 = (k2.suffix || (kode2.length >= 2 ? kode2.slice(-2) : "")).toUpperCase();

  return checkSuffixConflict(suffix1, suffix2);
}


function checkSuffixConflict(s1, s2) {
  if (!s1 || !s2) return false;
  if (s1 === s2) return true;

  // Aturan Grup A
  const isABTheoryPractice = s1 === "AB" || s2 === "AB";
  if (isABTheoryPractice) return true;
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
  const data = await masterDataRepo.getFormOptionsRaw(kurikulumId);
  if (!data || !data.kurikulum_exists) {
    const error = new Error(`Data kurikulum dengan ID ${kurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const sesi = (data.sesi || []).map((item, idx) => ({
    id: item.id,
    nama: `Sesi ${idx + 1}`,
  }));

  return {
    ruang: data.ruang || [],
    dosen: data.dosen || [],
    sesi,
    kelas: data.kelas || [],
    mata_kuliah: data.mata_kuliah || [],
  };
}

async function validatePenjadwalanDataAndConflicts(payload, excludeId = null) {
  const kurikulumId = Number(payload.kurikulum_id);
  const matkulId = Number(payload.matkul_id);
  const ruangId = Number(payload.ruang_id);
  const kelasId = Number(payload.kelas_id);
  const hariRaw = payload.hari?.trim();
  const hari = hariRaw ? hariRaw.charAt(0).toUpperCase() + hariRaw.slice(1).toLowerCase() : "";

  const sesiIds = payload.sesi_ids

  const dosenIds = payload.dosen_ids

  if (sesiIds.length === 0) {
    const error = new Error("Field sesi_ids harus diisi minimal 1 sesi");
    error.statusCode = 400;
    throw error;
  }

  if (dosenIds.length === 0) {
    const error = new Error("Field dosen_ids harus diisi minimal 1 dosen");
    error.statusCode = 400;
    throw error;
  }

  // 1 & 2. Validasi keberadaan kurikulum & entitas master-data via 1 raw SQL query
  const check = await masterDataRepo.validatePenjadwalanMasterDataRaw({
    kurikulumId,
    kelasId,
    matkulId,
    ruangId,
    dosenIds,
    sesiIds,
  });

  if (!check || !check.kurikulum_exists) {
    const error = new Error(`Data kurikulum dengan ID ${kurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  if (!check.kelas_info) {
    const error = new Error(`Data kelas dengan ID ${kelasId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  if (!check.kelas_info.in_kurikulum) {
    const error = new Error(`Data kelas dengan ID ${kelasId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  if (!check.matkul_info) {
    const error = new Error(`Data mata kuliah dengan ID ${matkulId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  if (!check.matkul_info.in_kurikulum) {
    const error = new Error(`Data mata kuliah dengan ID ${matkulId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  const dosensInfo = check.dosens_info || [];
  for (const dId of dosenIds) {
    const targetDosen = dosensInfo.find((d) => Number(d.id) === Number(dId));
    if (!targetDosen) {
      const error = new Error(`Data dosen dengan ID ${dId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
    if (!targetDosen.in_kurikulum) {
      const error = new Error(`Data dosen dengan ID ${dId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
      error.statusCode = 400;
      throw error;
    }
  }

  if (!check.ruang_info) {
    const error = new Error(`Data ruang dengan ID ${ruangId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }
  if (!check.ruang_info.in_kurikulum) {
    const error = new Error(`Data ruang dengan ID ${ruangId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
    error.statusCode = 400;
    throw error;
  }

  const sesisInfo = check.sesis_info || [];
  const targetSesiMap = new Map();
  for (const sId of sesiIds) {
    const targetSesi = sesisInfo.find((s) => Number(s.id) === Number(sId));
    if (!targetSesi) {
      const error = new Error(`Data sesi dengan ID ${sId} tidak ditemukan`);
      error.statusCode = 404;
      throw error;
    }
    if (!targetSesi.in_kurikulum) {
      const error = new Error(`Data sesi dengan ID ${sId} tidak terdaftar pada kurikulum ID ${kurikulumId}`);
      error.statusCode = 400;
      throw error;
    }
    targetSesiMap.set(sId, targetSesi);
  }

  const targetKelas = check.kelas_info.data;
  const targetRuang = check.ruang_info.data;

  // 3. Ambil seluruh jadwal yang sudah ada pada slot (kurikulum_id, sesiIds, hari)
  const rawExistingSchedules = await penjadwalanRepo.getExistingSchedulesBySlots(
    kurikulumId,
    sesiIds,
    hari
  );

  // Pengecualian dengan ID yang sama (jika update)
  const existingSchedules = excludeId
    ? rawExistingSchedules.filter((s) => Number(s.id) !== Number(excludeId))
    : rawExistingSchedules;

  // 4. Pengecekan bentrok berurutan sesuai spesifikasi per slot sesi:
  for (const sId of sesiIds) {
    const targetSesi = targetSesiMap.get(sId);
    const slotExisting = existingSchedules.filter((s) => Number(s.sesi_id) === Number(sId));

    // Step 4.1: Cek apakah kelas tersebut sudah digunakan pada sesi dan hari tersebut
    const kelasUsed = slotExisting.find((s) => Number(s.kelas_id) === Number(kelasId));
    if (kelasUsed) {
      const error = new Error(
        `Kelas ${targetKelas.kode_kelas} sudah memiliki jadwal pada hari ${hari} dan sesi ${targetSesi.jam_mulai} - ${targetSesi.jam_akhir}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Step 4.2: Cek apakah terdapat bentrok ruang sudah dipakai
    const ruangUsed = slotExisting.find((s) => Number(s.ruang_id) === Number(ruangId));
    if (ruangUsed) {
      const error = new Error(
        `Ruang '${targetRuang.nama}' sudah digunakan pada hari ${hari} dan sesi ${targetSesi.jam_mulai} - ${targetSesi.jam_akhir}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Step 4.3: Cek apakah dosen pada sesi dan hari tersebut sudah ada jadwal
    for (const dId of dosenIds) {
      const dosenUsed = slotExisting.find((s) => Number(s.dosen_id) === Number(dId));
      if (dosenUsed) {
        const error = new Error(
          `Dosen '${dosenUsed.nama_dosen}' sudah memiliki jadwal mengajar pada hari ${hari} dan sesi ${targetSesi.jam_mulai} - ${targetSesi.jam_akhir}`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    // Step 4.4: Pengecekan bentrok kelas kompleks (misal PL4AA vs PL4A1/PL4A2, PL4BB vs PL4B1/PL4B2)
    for (const existing of slotExisting) {
      if (isKelasConflict(targetKelas, existing)) {
        const error = new Error(
          `Kelas ${targetKelas.kode_kelas} bentrok dengan jadwal kelas ${existing.kode_kelas} pada hari ${hari} dan sesi ${targetSesi.jam_mulai} - ${targetSesi.jam_akhir}`
        );
        error.statusCode = 400;
        throw error;
      }
    }
  }

  return {
    kurikulumId,
    matkulId,
    ruangId,
    kelasId,
    hari,
    sesiIds,
    dosenIds,
  };
}

export async function createPenjadwalanService(payload) {
  const validated = await validatePenjadwalanDataAndConflicts(payload);

  const created = await penjadwalanRepo.createPenjadwalan({
    kurikulum_id: validated.kurikulumId,
    matkul_id: validated.matkulId,
    ruang_id: validated.ruangId,
    kelas_id: validated.kelasId,
    hari: validated.hari,
    sesi_ids: validated.sesiIds,
    dosen_ids: validated.dosenIds,
  });

  return await penjadwalanRepo.getPenjadwalanById(created.id);
}

export async function updatePenjadwalanService(id, payload) {
  const existingSchedule = await penjadwalanRepo.getPenjadwalanById(id);
  if (!existingSchedule) {
    const error = new Error(`Data penjadwalan dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const payloadWithDefaults = {
    ...payload,
    kurikulum_id: payload.kurikulum_id,
    sesi_ids: payload.sesi_ids,
    dosen_ids: payload.dosen_ids,
  };

  const validated = await validatePenjadwalanDataAndConflicts(payloadWithDefaults, id);

  await penjadwalanRepo.updatePenjadwalan(id, {
    kurikulum_id: validated.kurikulumId,
    matkul_id: validated.matkulId,
    ruang_id: validated.ruangId,
    kelas_id: validated.kelasId,
    hari: validated.hari,
    sesi_ids: validated.sesiIds,
    dosen_ids: validated.dosenIds,
  });

  return await penjadwalanRepo.getPenjadwalanById(id);
}

export async function deletePenjadwalanService(id) {
  const existingSchedule = await penjadwalanRepo.getPenjadwalanById(id);
  if (!existingSchedule) {
    const error = new Error(`Data penjadwalan dengan ID ${id} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  await penjadwalanRepo.deletePenjadwalan(id);
  return existingSchedule;
}

const DAY_ORDER = ["senin", "selasa", "rabu", "kamis", "jumat"];

function createSesiOrderMap(sesiList) {
  const map = new Map();
  sesiList.forEach((s, idx) => {
    map.set(Number(s.id), idx + 1);
  });
  return map;
}

function groupSchedulesByDay(schedules, sesiOrderMap) {
  const dayMap = new Map();

  for (const s of schedules) {
    const rawHari = (s.hari || "").trim().toLowerCase();
    if (!rawHari) continue;

    const sIds = Array.isArray(s.sesi_ids) && s.sesi_ids.length > 0
      ? s.sesi_ids
      : s.sesi_id ? [s.sesi_id] : [];

    for (const sid of sIds) {
      const sesiOrder = sesiOrderMap.get(Number(sid));
      if (!sesiOrder) continue;

      if (!dayMap.has(rawHari)) {
        dayMap.set(rawHari, new Set());
      }
      dayMap.get(rawHari).add(sesiOrder);
    }
  }

  const sortedDays = Array.from(dayMap.keys()).sort((a, b) => {
    const indexA = DAY_ORDER.indexOf(a);
    const indexB = DAY_ORDER.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  return sortedDays.map((hari) => ({
    hari,
    sesi: Array.from(dayMap.get(hari)).sort((a, b) => a - b),
  }));
}

function formatRuangSchedules(schedules, sesiOrderMap) {
  const result = [];

  for (const s of schedules) {
    const rawHari = (s.hari || "").trim().toLowerCase();
    if (!rawHari) continue;

    const sIds = Array.isArray(s.sesi_ids) && s.sesi_ids.length > 0
      ? s.sesi_ids
      : s.sesi_id ? [s.sesi_id] : [];

    const sesiList = sIds
      .map((sid) => sesiOrderMap.get(Number(sid)))
      .filter((order) => order !== undefined)
      .sort((a, b) => a - b);

    if (sesiList.length === 0) continue;

    const namaDosen = Array.isArray(s.dosen_names) && s.dosen_names.length > 0
      ? s.dosen_names.join(", ")
      : (s.nama_dosen || "");

    result.push({
      hari: rawHari,
      sesi: sesiList,
      nama_matkul: s.nama_matkul || "",
      kode_kelas: s.kode_kelas || "",
      nama_dosen: namaDosen,
    });
  }

  result.sort((a, b) => {
    const indexA = DAY_ORDER.indexOf(a.hari);
    const indexB = DAY_ORDER.indexOf(b.hari);
    const dayDiff = (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    if (dayDiff !== 0) return dayDiff;

    const firstSesiA = a.sesi.length > 0 ? a.sesi[0] : 999;
    const firstSesiB = b.sesi.length > 0 ? b.sesi[0] : 999;
    return firstSesiA - firstSesiB;
  });

  return result;
}

export async function getPenjadwalanRuangService(kurikulumId) {
  const exists = await masterDataRepo.checkKurikulumExists(kurikulumId);
  if (!exists) {
    const error = new Error(`Data kurikulum dengan ID ${kurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const [ruangList, sesiList, schedules] = await Promise.all([
    masterDataRepo.getRuangByKurikulumId(kurikulumId),
    masterDataRepo.getSesiByKurikulumId(kurikulumId),
    penjadwalanRepo.getPenjadwalanWithDetailsByKurikulumId(kurikulumId),
  ]);

  const sesiOrderMap = createSesiOrderMap(sesiList);
  const totalSesi = sesiList.length;
  const maxWeeklySlots = totalSesi * 5;

  return ruangList.map((r) => {
    const rSchedules = schedules.filter((s) => Number(s.ruang_id) === Number(r.id));
    const usedCount = rSchedules.reduce((acc, s) => {
      return acc + (Array.isArray(s.sesi_ids) && s.sesi_ids.length > 0 ? s.sesi_ids.length : (s.sesi_id ? 1 : 0));
    }, 0);

    let okupansi = "0%";
    if (maxWeeklySlots > 0) {
      const percentage = (usedCount / maxWeeklySlots) * 100;
      okupansi = `${parseFloat(percentage.toFixed(2))}%`;
    }

    const jadwal = formatRuangSchedules(rSchedules, sesiOrderMap);

    return {
      id: r.id,
      nama: r.nama,
      okupansi,
      jadwal,
    };
  });
}

function formatKelasSchedules(schedules, sesiOrderMap) {
  const result = [];

  for (const s of schedules) {
    const rawHari = (s.hari || "").trim().toLowerCase();
    if (!rawHari) continue;

    const sIds = Array.isArray(s.sesi_ids) && s.sesi_ids.length > 0
      ? s.sesi_ids
      : s.sesi_id ? [s.sesi_id] : [];

    const sesiList = sIds
      .map((sid) => sesiOrderMap.get(Number(sid)))
      .filter((order) => order !== undefined)
      .sort((a, b) => a - b);

    if (sesiList.length === 0) continue;

    const namaDosen = Array.isArray(s.dosen_names) && s.dosen_names.length > 0
      ? s.dosen_names.join(", ")
      : (s.nama_dosen || "");

    result.push({
      hari: rawHari,
      sesi: sesiList,
      nama_matkul: s.nama_matkul || "",
      nama_ruang: s.nama_ruang || "",
      nama_dosen: namaDosen,
    });
  }

  result.sort((a, b) => {
    const indexA = DAY_ORDER.indexOf(a.hari);
    const indexB = DAY_ORDER.indexOf(b.hari);
    const dayDiff = (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    if (dayDiff !== 0) return dayDiff;

    const firstSesiA = a.sesi.length > 0 ? a.sesi[0] : 999;
    const firstSesiB = b.sesi.length > 0 ? b.sesi[0] : 999;
    return firstSesiA - firstSesiB;
  });

  return result;
}

export async function getPenjadwalanKelasService(kurikulumId) {
  const exists = await masterDataRepo.checkKurikulumExists(kurikulumId);
  if (!exists) {
    const error = new Error(`Data kurikulum dengan ID ${kurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const [kelasList, sesiList, schedules] = await Promise.all([
    masterDataRepo.getKelasByKurikulumId(kurikulumId),
    masterDataRepo.getSesiByKurikulumId(kurikulumId),
    penjadwalanRepo.getPenjadwalanWithDetailsByKurikulumId(kurikulumId),
  ]);

  const sesiOrderMap = createSesiOrderMap(sesiList);

  return kelasList.map((k) => {
    const kSchedules = schedules.filter((s) => Number(s.kelas_id) === Number(k.id));
    const jadwal = formatKelasSchedules(kSchedules, sesiOrderMap);

    return {
      id: k.id,
      nama: k.kode_kelas,
      jadwal,
    };
  });
}

function formatDosenSchedules(schedules, sesiOrderMap) {
  const result = [];

  for (const s of schedules) {
    const rawHari = (s.hari || "").trim().toLowerCase();
    if (!rawHari) continue;

    const sIds = Array.isArray(s.sesi_ids) && s.sesi_ids.length > 0
      ? s.sesi_ids
      : s.sesi_id ? [s.sesi_id] : [];

    const sesiList = sIds
      .map((sid) => sesiOrderMap.get(Number(sid)))
      .filter((order) => order !== undefined)
      .sort((a, b) => a - b);

    if (sesiList.length === 0) continue;

    result.push({
      hari: rawHari,
      sesi: sesiList,
      nama_matkul: s.nama_matkul || "",
      kode_kelas: s.kode_kelas || "",
      nama_ruang: s.nama_ruang || "",
    });
  }

  result.sort((a, b) => {
    const indexA = DAY_ORDER.indexOf(a.hari);
    const indexB = DAY_ORDER.indexOf(b.hari);
    const dayDiff = (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    if (dayDiff !== 0) return dayDiff;

    const firstSesiA = a.sesi.length > 0 ? a.sesi[0] : 999;
    const firstSesiB = b.sesi.length > 0 ? b.sesi[0] : 999;
    return firstSesiA - firstSesiB;
  });

  return result;
}

export async function getPenjadwalanDosenService(kurikulumId) {
  const exists = await masterDataRepo.checkKurikulumExists(kurikulumId);
  if (!exists) {
    const error = new Error(`Data kurikulum dengan ID ${kurikulumId} tidak ditemukan`);
    error.statusCode = 404;
    throw error;
  }

  const [dosenList, sesiList, schedules] = await Promise.all([
    masterDataRepo.getDosenByKurikulumId(kurikulumId),
    masterDataRepo.getSesiByKurikulumId(kurikulumId),
    penjadwalanRepo.getPenjadwalanWithDetailsByKurikulumId(kurikulumId),
  ]);

  const sesiOrderMap = createSesiOrderMap(sesiList);

  return dosenList.map((d) => {
    const dSchedules = schedules.filter((s) => {
      if (Array.isArray(s.dosen_ids) && s.dosen_ids.length > 0) {
        return s.dosen_ids.some((id) => Number(id) === Number(d.id));
      }
      return Number(s.dosen_id) === Number(d.id);
    });

    // Akumulasi beban_sks per kelas/jadwal yang diajar
    const seenClassMatkul = new Set();
    let bebanSks = 0;
    for (const s of dSchedules) {
      const key = `${s.matkul_id}_${s.kelas_id}`;
      if (!seenClassMatkul.has(key)) {
        seenClassMatkul.add(key);
        bebanSks += Number(s.sks || 0);
      }
    }

    const jadwal = formatDosenSchedules(dSchedules, sesiOrderMap);

    return {
      id: d.id,
      nama: d.nama,
      beban_sks: bebanSks,
      jadwal,
    };
  });
}

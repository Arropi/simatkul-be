import * as masterDataRepo from "../../repositories/penjadwalan/master-data-repositories.js";
import { generatePenjadwalanWorkbook } from "../../utils/excel-ui.js";
import {
  getPenjadwalanDosenService,
  getPenjadwalanKelasService,
  getPenjadwalanRuangService,
} from "./penjadwalan-service.js";



/**
 * Export Excel Penjadwalan Dosen
 */
export async function exportPenjadwalanDosenExcel(kurikulumId) {
  const [dosenData, sesiList] = await Promise.all([
    getPenjadwalanDosenService(kurikulumId),
    masterDataRepo.getSesiByKurikulumId(kurikulumId),
  ]);

  const buffer = await generatePenjadwalanWorkbook({
    sheetName: "Jadwal Dosen",
    col1Header: "Nama Dosen",
    type: "dosen",
    items: dosenData,
    totalSesi: sesiList.length,
  });

  return {
    buffer,
    filename: `jadwal-dosen-kurikulum-${kurikulumId}.xlsx`,
  };
}

/**
 * Export Excel Penjadwalan Kelas
 */
export async function exportPenjadwalanKelasExcel(kurikulumId) {
  const [kelasData, sesiList] = await Promise.all([
    getPenjadwalanKelasService(kurikulumId),
    masterDataRepo.getSesiByKurikulumId(kurikulumId),
  ]);

  const buffer = await generatePenjadwalanWorkbook({
    sheetName: "Jadwal Kelas",
    col1Header: "Kelas",
    type: "kelas",
    items: kelasData,
    totalSesi: sesiList.length,
  });

  return {
    buffer,
    filename: `jadwal-kelas-kurikulum-${kurikulumId}.xlsx`,
  };
}

/**
 * Export Excel Penjadwalan Ruang
 */
export async function exportPenjadwalanRuangExcel(kurikulumId) {
  const [ruangData, sesiList] = await Promise.all([
    getPenjadwalanRuangService(kurikulumId),
    masterDataRepo.getSesiByKurikulumId(kurikulumId),
  ]);

  const buffer = await generatePenjadwalanWorkbook({
    sheetName: "Jadwal Ruang",
    col1Header: "Ruang",
    type: "ruang",
    items: ruangData,
    totalSesi: sesiList.length,
  });

  return {
    buffer,
    filename: `jadwal-ruang-kurikulum-${kurikulumId}.xlsx`,
  };
}

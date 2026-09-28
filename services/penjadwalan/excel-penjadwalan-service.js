import ExcelJS from "exceljs";
import * as masterDataRepo from "../../repositories/penjadwalan/master-data-repositories.js";
import {
  getPenjadwalanDosenService,
  getPenjadwalanKelasService,
  getPenjadwalanRuangService,
} from "./penjadwalan-service.js";

const DAYS = [
  { key: "senin", label: "Senin" },
  { key: "selasa", label: "Selasa" },
  { key: "rabu", label: "Rabu" },
  { key: "kamis", label: "Kamis" },
  { key: "jumat", label: "Jumat" },
];

/**
 * Memecah array nomor sesi menjadi segment-segment yang berurutan secara kontigu.
 * Contoh: [1, 2, 4] -> [[1, 2], [4]]
 */
function getContiguousSegments(sesiArr) {
  if (!sesiArr || sesiArr.length === 0) return [];
  const sorted = [...sesiArr].sort((a, b) => a - b);
  const segments = [];
  let currentSegment = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      currentSegment.push(sorted[i]);
    } else {
      segments.push(currentSegment);
      currentSegment = [sorted[i]];
    }
  }
  segments.push(currentSegment);
  return segments;
}

/**
 * Core builder untuk export Excel Jadwal Penjadwalan
 * @param {Object} options
 * @param {string} options.sheetName - Nama sheet Excel
 * @param {string} options.col1Header - Label kolom 1 ("Nama Dosen", "Kelas", atau "Ruang")
 * @param {'dosen' | 'kelas' | 'ruang'} options.type - Tipe entitas yang diexport
 * @param {Array} options.items - Data hasil service penjadwalan
 * @param {number} options.totalSesi - Jumlah sesi kurikulum
 */
async function generatePenjadwalanWorkbook({
  sheetName,
  col1Header,
  type,
  items,
  totalSesi,
}) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "SIMATKUL";
  wb.created = new Date();

  const ws = wb.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
  });

  // Konfigurasi lebar kolom
  ws.columns = [
    { key: "entity", width: 32 },
    { key: "sesi", width: 10 },
    { key: "senin", width: 28 },
    { key: "selasa", width: 28 },
    { key: "rabu", width: 28 },
    { key: "kamis", width: 28 },
    { key: "jumat", width: 28 },
  ];

  // Header Row
  const headerLabels = [col1Header, "Sesi", ...DAYS.map((d) => d.label)];
  const headerRow = ws.addRow(headerLabels);
  headerRow.height = 34;

  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Segoe UI",
      size: 11,
      bold: true,
      color: { argb: "FF1E293B" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCBD5E1" } },
      bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
      left: { style: "thin", color: { argb: "FFCBD5E1" } },
      right: { style: "thin", color: { argb: "FFCBD5E1" } },
    };
  });

  const sessionCount = Math.max(totalSesi, 1);
  const rowsPerEntity = sessionCount * 2;
  let currentRow = 2;

  for (const item of items) {
    const startRow = currentRow;
    const endRow = startRow + rowsPerEntity - 1;

    // Inisialisasi tinggi baris data
    for (let r = startRow; r <= endRow; r++) {
      ws.getRow(r).height = 24;
    }

    // 1. Kolom Entitas (Nama Dosen / Kelas / Ruang)
    ws.mergeCells(startRow, 1, endRow, 1);
    const entityCell = ws.getCell(startRow, 1);

    if (type === "dosen") {
      entityCell.value = {
        richText: [
          {
            text: (item.nama || "-") + "\n",
            font: {
              name: "Segoe UI",
              size: 11,
              bold: true,
              color: { argb: "FF1E3A8A" },
            },
          },
          {
            text: `Beban Dosen: ${item.beban_sks ?? 0} SKS`,
            font: {
              name: "Segoe UI",
              size: 9,
              bold: false,
              color: { argb: "FF64748B" },
            },
          },
        ],
      };
    } else if (type === "ruang") {
      entityCell.value = {
        richText: [
          {
            text: (item.nama || "-") + "\n",
            font: {
              name: "Segoe UI",
              size: 11,
              bold: true,
              color: { argb: "FF1E3A8A" },
            },
          },
          {
            text: `Okupansi: ${item.okupansi || "0%"}`,
            font: {
              name: "Segoe UI",
              size: 9,
              bold: false,
              color: { argb: "FF64748B" },
            },
          },
        ],
      };
    } else {
      // type === "kelas"
      entityCell.value = {
        richText: [
          {
            text: item.nama || "-",
            font: {
              name: "Segoe UI",
              size: 11,
              bold: true,
              color: { argb: "FF1E3A8A" },
            },
          },
        ],
      };
    }

    entityCell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    for (let r = startRow; r <= endRow; r++) {
      const c = ws.getCell(r, 1);
      c.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
      };
      c.border = {
        top: r === startRow ? { style: "thin", color: { argb: "FFE2E8F0" } } : undefined,
        bottom: r === endRow ? { style: "thin", color: { argb: "FFE2E8F0" } } : undefined,
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    }

    // 2. Kolom Sesi
    for (let s = 1; s <= sessionCount; s++) {
      const sTop = startRow + (s - 1) * 2;
      const sBottom = sTop + 1;
      ws.mergeCells(sTop, 2, sBottom, 2);

      const cellSesi = ws.getCell(sTop, 2);
      cellSesi.value = s;
      cellSesi.font = {
        name: "Segoe UI",
        size: 11,
        bold: true,
        color: { argb: "FF0284C7" },
      };
      cellSesi.alignment = { vertical: "middle", horizontal: "center" };

      for (let r = sTop; r <= sBottom; r++) {
        const c = ws.getCell(r, 2);
        c.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE0F2FE" },
        };
        c.border = {
          top: r === sTop ? { style: "thin", color: { argb: "FFBAE6FD" } } : undefined,
          bottom: r === sBottom ? { style: "thin", color: { argb: "FFBAE6FD" } } : undefined,
          left: { style: "thin", color: { argb: "FFBAE6FD" } },
          right: { style: "thin", color: { argb: "FFBAE6FD" } },
        };
      }
    }

    // 3. Kolom Hari (Senin s/d Jumat)
    DAYS.forEach((dayObj, dayIdx) => {
      const colIdx = 3 + dayIdx;
      const dayJadwal = (item.jadwal || []).filter(
        (j) => (j.hari || "").trim().toLowerCase() === dayObj.key
      );

      const occupiedSesi = new Set();

      // Isi jadwal yang ada
      for (const j of dayJadwal) {
        const sesiArr = (j.sesi || []).filter(
          (s) => Number.isInteger(s) && s >= 1 && s <= sessionCount
        );
        if (sesiArr.length === 0) continue;

        const segments = getContiguousSegments(sesiArr);

        for (const seg of segments) {
          const minS = Math.min(...seg);
          const maxS = Math.max(...seg);

          for (let s = minS; s <= maxS; s++) {
            occupiedSesi.add(s);
          }

          const blockTop = startRow + (minS - 1) * 2;
          const blockBottom = startRow + (maxS - 1) * 2 + 1;

          // Format teks detail baris kedua sesuai tipe entitas
          let detail = "";
          if (type === "dosen") {
            // [Kode Kelas - Nama Ruang]
            detail =
              j.kode_kelas && j.nama_ruang
                ? `${j.kode_kelas} - ${j.nama_ruang}`
                : j.kode_kelas || j.nama_ruang || "";
          } else if (type === "ruang") {
            // [Kode Kelas - Nama Dosen]
            detail =
              j.kode_kelas && j.nama_dosen
                ? `${j.kode_kelas} - ${j.nama_dosen}`
                : j.kode_kelas || j.nama_dosen || "";
          } else {
            // type === "kelas": [Nama Ruang - Nama Dosen]
            detail =
              j.nama_ruang && j.nama_dosen
                ? `${j.nama_ruang} - ${j.nama_dosen}`
                : j.nama_ruang || j.nama_dosen || "";
          }

          ws.mergeCells(blockTop, colIdx, blockBottom, colIdx);
          const blockCell = ws.getCell(blockTop, colIdx);

          blockCell.value = {
            richText: [
              {
                text: (j.nama_matkul || "") + (detail ? "\n" : ""),
                font: {
                  name: "Segoe UI",
                  size: 10,
                  bold: true,
                  color: { argb: "FF9A3412" },
                },
              },
              ...(detail
                ? [
                    {
                      text: detail,
                      font: {
                        name: "Segoe UI",
                        size: 8.5,
                        bold: false,
                        color: { argb: "FFC2410C" },
                      },
                    },
                  ]
                : []),
            ],
          };

          blockCell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };

          for (let r = blockTop; r <= blockBottom; r++) {
            const c = ws.getCell(r, colIdx);
            c.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFEDD5" },
            };
            c.border = {
              top: r === blockTop ? { style: "thin", color: { argb: "FFFDBA74" } } : undefined,
              bottom: r === blockBottom ? { style: "thin", color: { argb: "FFFDBA74" } } : undefined,
              left: { style: "thin", color: { argb: "FFFDBA74" } },
              right: { style: "thin", color: { argb: "FFFDBA74" } },
            };
          }
        }
      }

      // Isi slot sesi yang kosong dengan '-'
      for (let s = 1; s <= sessionCount; s++) {
        if (occupiedSesi.has(s)) continue;

        const emptyTop = startRow + (s - 1) * 2;
        const emptyBottom = emptyTop + 1;

        ws.mergeCells(emptyTop, colIdx, emptyBottom, colIdx);
        const emptyCell = ws.getCell(emptyTop, colIdx);
        emptyCell.value = "-";
        emptyCell.font = {
          name: "Segoe UI",
          size: 11,
          bold: false,
          color: { argb: "FF94A3B8" },
        };
        emptyCell.alignment = { vertical: "middle", horizontal: "center" };

        for (let r = emptyTop; r <= emptyBottom; r++) {
          const c = ws.getCell(r, colIdx);
          c.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
          c.border = {
            top: r === emptyTop ? { style: "thin", color: { argb: "FFE2E8F0" } } : undefined,
            bottom: r === emptyBottom ? { style: "thin", color: { argb: "FFE2E8F0" } } : undefined,
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } },
          };
        }
      }
    });

    currentRow = endRow + 1;
  }

  const buffer = await wb.xlsx.writeBuffer();
  return buffer;
}

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

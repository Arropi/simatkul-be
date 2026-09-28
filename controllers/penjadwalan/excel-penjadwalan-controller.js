import * as excelService from "../../services/penjadwalan/excel-penjadwalan-service.js";

function sendExcelResponse(res, buffer, filename) {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );
  res.send(Buffer.from(buffer));
}

export async function exportExcelDosen(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const { buffer, filename } =
      await excelService.exportPenjadwalanDosenExcel(kurikulumId);
    sendExcelResponse(res, buffer, filename);
  } catch (error) {
    next(error);
  }
}

export async function exportExcelKelas(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const { buffer, filename } =
      await excelService.exportPenjadwalanKelasExcel(kurikulumId);
    sendExcelResponse(res, buffer, filename);
  } catch (error) {
    next(error);
  }
}

export async function exportExcelRuang(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const { buffer, filename } =
      await excelService.exportPenjadwalanRuangExcel(kurikulumId);
    sendExcelResponse(res, buffer, filename);
  } catch (error) {
    next(error);
  }
}

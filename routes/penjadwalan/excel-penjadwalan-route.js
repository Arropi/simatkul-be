import { Router } from "express";
import * as excelController from "../../controllers/penjadwalan/excel-penjadwalan-controller.js";
import { kurikulumParamValidation } from "../../validation/penjadwalan-validation.js";

const excelPenjadwalanRouter = Router();

excelPenjadwalanRouter.get(
  "/export-excel/dosen/:kurikulumId",
  kurikulumParamValidation,
  excelController.exportExcelDosen
);

excelPenjadwalanRouter.get(
  "/export-excel/kelas/:kurikulumId",
  kurikulumParamValidation,
  excelController.exportExcelKelas
);

excelPenjadwalanRouter.get(
  "/export-excel/ruang/:kurikulumId",
  kurikulumParamValidation,
  excelController.exportExcelRuang
);

export default excelPenjadwalanRouter;

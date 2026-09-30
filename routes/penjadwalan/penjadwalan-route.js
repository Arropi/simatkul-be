import { Router } from "express";
import * as penjadwalanController from "../../controllers/penjadwalan/penjadwalan-controller.js";
import {
  kurikulumParamValidation,
  penjadwalanValidation,
  penjadwalanIdParamValidation,
} from "../../validation/penjadwalan-validation.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import excelPenjadwalanRouter from "./excel-penjadwalan-route.js";

const penjadwalanRouter = Router();

penjadwalanRouter.use(excelPenjadwalanRouter);

penjadwalanRouter.get(
  "/form-options/:kurikulumId",
  kurikulumParamValidation,
  penjadwalanController.getFormOptions
);

penjadwalanRouter.get(
  "/ruang/:kurikulumId",
  kurikulumParamValidation,
  penjadwalanController.getPenjadwalanRuang
);

penjadwalanRouter.get(
  "/kelas/:kurikulumId",
  kurikulumParamValidation,
  penjadwalanController.getPenjadwalanKelas
);

penjadwalanRouter.get(
  "/dosen/:kurikulumId",
  kurikulumParamValidation,
  penjadwalanController.getPenjadwalanDosen
);

penjadwalanRouter.get(
  "/jadwal/:penjadwalanId",
  penjadwalanIdParamValidation,
  penjadwalanController.getPenjadwalanByIdFormatted
);

penjadwalanRouter.get(
  "/:kurikulumId",
  kurikulumParamValidation,
  penjadwalanController.getAllPenjadwalanByKurikulum
);

penjadwalanRouter.post(
  "/",
  authMiddleware,
  penjadwalanValidation,
  penjadwalanController.createPenjadwalan
);

penjadwalanRouter.put(
  "/:penjadwalan_id",
  authMiddleware,
  penjadwalanIdParamValidation,
  penjadwalanValidation,
  penjadwalanController.updatePenjadwalan
);

penjadwalanRouter.delete(
  "/:penjadwalan_id",
  authMiddleware,
  penjadwalanIdParamValidation,
  penjadwalanController.deletePenjadwalan
);

export default penjadwalanRouter;

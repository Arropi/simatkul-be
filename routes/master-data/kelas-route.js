import { Router } from "express";
import * as kelasController from "../../controllers/master-data/kelas-controller.js";
import {
  kelasValidation,
  updateKelasValidation,
  idParamValidation,
  kurikulumParamValidation,
} from "../../validation/master-data-validation.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const kelasRouter = Router();

kelasRouter.get("/", kelasController.getAllKelas);
kelasRouter.get("/kurikulum/:kurikulumId", kurikulumParamValidation, kelasController.getKelasByKurikulumId);
kelasRouter.get("/:id", idParamValidation, kelasController.getKelasById);
kelasRouter.post("/:kurikulumId", authMiddleware, kurikulumParamValidation, kelasValidation, kelasController.createKelas);
kelasRouter.put("/:kurikulumId", authMiddleware, kurikulumParamValidation, updateKelasValidation, kelasController.updateKelas);
kelasRouter.delete("/:kurikulumId", authMiddleware, kurikulumParamValidation, kelasController.deleteKelas);

export default kelasRouter;

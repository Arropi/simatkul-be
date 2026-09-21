import { Router } from "express";
import * as kelasController from "../../controllers/master-data/kelas-controller.js";
import {
  kelasValidation,
  updateKelasValidation,
  idParamValidation,
  kurikulumParamValidation,
} from "../../validation/master-data-validation.js";

const kelasRouter = Router();

kelasRouter.get("/", kelasController.getAllKelas);
kelasRouter.get("/kurikulum/:kurikulumId", kurikulumParamValidation, kelasController.getKelasByKurikulumId);
kelasRouter.get("/:id", idParamValidation, kelasController.getKelasById);
kelasRouter.post("/:kurikulumId", kurikulumParamValidation, kelasValidation, kelasController.createKelas);
kelasRouter.put("/:id", idParamValidation, updateKelasValidation, kelasController.updateKelas);
kelasRouter.delete("/:id", idParamValidation, kelasController.deleteKelas);

export default kelasRouter;

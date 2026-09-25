import { Router } from "express";
import * as dosenController from "../../controllers/master-data/dosen-controller.js";
import {
  dosenValidation,
  idParamValidation,
  kurikulumParamValidation,
} from "../../validation/master-data-validation.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const dosenRouter = Router();

dosenRouter.get("/", dosenController.getAllDosen);
dosenRouter.get("/kurikulum/:kurikulumId", kurikulumParamValidation, dosenController.getDosenByKurikulumId);
dosenRouter.get("/:id", idParamValidation, dosenController.getDosenById);
dosenRouter.post("/:kurikulumId", authMiddleware, kurikulumParamValidation, dosenValidation, dosenController.createDosen);
dosenRouter.put("/:id", authMiddleware, idParamValidation, dosenValidation, dosenController.updateDosen);
dosenRouter.delete("/:id", authMiddleware, idParamValidation, dosenController.deleteDosen);

export default dosenRouter;

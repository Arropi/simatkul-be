import { Router } from "express";
import * as sesiController from "../../controllers/master-data/sesi-controller.js";
import {
  sesiValidation,
  idParamValidation,
  kurikulumParamValidation,
} from "../../validation/master-data-validation.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const sesiRouter = Router();

sesiRouter.get("/", sesiController.getAllSesi);
sesiRouter.get("/kurikulum/:kurikulumId", kurikulumParamValidation, sesiController.getSesiByKurikulumId);
sesiRouter.get("/:id", idParamValidation, sesiController.getSesiById);
sesiRouter.post("/:kurikulumId", authMiddleware, kurikulumParamValidation, sesiValidation, sesiController.createSesi);
sesiRouter.put("/:id", authMiddleware, idParamValidation, sesiValidation, sesiController.updateSesi);
sesiRouter.delete("/:id", authMiddleware, idParamValidation, sesiController.deleteSesi);

export default sesiRouter;

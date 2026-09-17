import { Router } from "express";
import * as sesiController from "../../controllers/master-data/sesi-controller.js";
import { sesiValidation, idParamValidation } from "../../validation/master-data-validation.js";

const sesiRouter = Router();

sesiRouter.get("/", sesiController.getAllSesi);
sesiRouter.get("/:id", idParamValidation, sesiController.getSesiById);
sesiRouter.post("/", sesiValidation, sesiController.createSesi);
sesiRouter.put("/:id", idParamValidation, sesiValidation, sesiController.updateSesi);
sesiRouter.delete("/:id", idParamValidation, sesiController.deleteSesi);

export default sesiRouter;

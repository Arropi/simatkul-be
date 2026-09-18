import { Router } from "express";
import * as dosenController from "../../controllers/master-data/dosen-controller.js";
import { dosenValidation, idParamValidation } from "../../validation/master-data-validation.js";

const dosenRouter = Router();

dosenRouter.get("/", dosenController.getAllDosen);
dosenRouter.get("/:id", idParamValidation, dosenController.getDosenById);
dosenRouter.post("/", dosenValidation, dosenController.createDosen);
dosenRouter.put("/:id", idParamValidation, dosenValidation, dosenController.updateDosen);
dosenRouter.delete("/:id", idParamValidation, dosenController.deleteDosen);

export default dosenRouter;

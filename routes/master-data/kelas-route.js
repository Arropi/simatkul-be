import { Router } from "express";
import * as kelasController from "../../controllers/master-data/kelas-controller.js";
import { kelasValidation, idParamValidation } from "../../validation/master-data-validation.js";

const kelasRouter = Router();

kelasRouter.get("/", kelasController.getAllKelas);
kelasRouter.get("/:id", idParamValidation, kelasController.getKelasById);
kelasRouter.post("/", kelasValidation, kelasController.createKelas);
kelasRouter.put("/:id", idParamValidation, kelasValidation, kelasController.updateKelas);
kelasRouter.delete("/:id", idParamValidation, kelasController.deleteKelas);

export default kelasRouter;

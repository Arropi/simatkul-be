import { Router } from "express";
import * as ruangController from "../../controllers/master-data/ruang-controller.js";
import { ruangValidation, idParamValidation } from "../../validation/master-data-validation.js";

const ruangRouter = Router();

ruangRouter.get("/", ruangController.getAllRuang);
ruangRouter.get("/:id", idParamValidation, ruangController.getRuangById);
ruangRouter.post("/", ruangValidation, ruangController.createRuang);
ruangRouter.put("/:id", idParamValidation, ruangValidation, ruangController.updateRuang);
ruangRouter.delete("/:id", idParamValidation, ruangController.deleteRuang);

export default ruangRouter;

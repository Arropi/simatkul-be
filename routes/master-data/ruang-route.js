import { Router } from "express";
import * as ruangController from "../../controllers/master-data/ruang-controller.js";
import {
  ruangValidation,
  idParamValidation,
  kurikulumParamValidation,
} from "../../validation/master-data-validation.js";

const ruangRouter = Router();

ruangRouter.get("/", ruangController.getAllRuang);
ruangRouter.get("/kurikulum/:kurikulumId", kurikulumParamValidation, ruangController.getRuangByKurikulumId);
ruangRouter.get("/:id", idParamValidation, ruangController.getRuangById);
ruangRouter.post("/:kurikulumId", kurikulumParamValidation, ruangValidation, ruangController.createRuang);
ruangRouter.put("/:id", idParamValidation, ruangValidation, ruangController.updateRuang);
ruangRouter.delete("/:id", idParamValidation, ruangController.deleteRuang);

export default ruangRouter;

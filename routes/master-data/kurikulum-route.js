import { Router } from "express";
import * as kurikulumController from "../../controllers/master-data/kurikulum-controller.js";
import { kurikulumValidation, idParamValidation } from "../../validation/master-data-validation.js";

const kurikulumRouter = Router();

kurikulumRouter.get("/", kurikulumController.getAllKurikulum);
kurikulumRouter.get("/:id", idParamValidation, kurikulumController.getKurikulumById);
kurikulumRouter.post("/", kurikulumValidation, kurikulumController.createKurikulum);
kurikulumRouter.put("/:id", idParamValidation, kurikulumValidation, kurikulumController.updateKurikulum);
kurikulumRouter.delete("/:id", idParamValidation, kurikulumController.deleteKurikulum);

export default kurikulumRouter;

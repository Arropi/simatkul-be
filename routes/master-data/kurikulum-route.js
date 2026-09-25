import { Router } from "express";
import * as kurikulumController from "../../controllers/master-data/kurikulum-controller.js";
import { kurikulumValidation, idParamValidation } from "../../validation/master-data-validation.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const kurikulumRouter = Router();

kurikulumRouter.get("/", kurikulumController.getAllKurikulum);
kurikulumRouter.get("/:id", idParamValidation, kurikulumController.getKurikulumById);
kurikulumRouter.post("/", authMiddleware, kurikulumValidation, kurikulumController.createKurikulum);
kurikulumRouter.put("/:id", authMiddleware, idParamValidation, kurikulumValidation, kurikulumController.updateKurikulum);
kurikulumRouter.delete("/:id", authMiddleware, idParamValidation, kurikulumController.deleteKurikulum);

export default kurikulumRouter;

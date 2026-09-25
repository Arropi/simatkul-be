import { Router } from "express";
import * as penjadwalanController from "../../controllers/penjadwalan/penjadwalan-controller.js";
import {
  kurikulumParamValidation,
  penjadwalanValidation,
} from "../../validation/penjadwalan-validation.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const penjadwalanRouter = Router();

penjadwalanRouter.get(
  "/form-options/:kurikulumId",
  kurikulumParamValidation,
  penjadwalanController.getFormOptions
);

penjadwalanRouter.post(
  "/",
  authMiddleware,
  penjadwalanValidation,
  penjadwalanController.createPenjadwalan
);

penjadwalanRouter.post(
  "/:kurikulumId",
  authMiddleware,
  kurikulumParamValidation,
  penjadwalanValidation,
  penjadwalanController.createPenjadwalan
);

export default penjadwalanRouter;

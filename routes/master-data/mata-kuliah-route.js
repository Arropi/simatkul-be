import { Router } from "express";
import * as mataKuliahController from "../../controllers/master-data/mata-kuliah-controller.js";
import {
  mataKuliahValidation,
  mataKuliahQueryValidation,
  idParamValidation,
  kurikulumParamValidation,
} from "../../validation/master-data-validation.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const mataKuliahRouter = Router();

mataKuliahRouter.get("/", mataKuliahController.getAllMataKuliah);
mataKuliahRouter.get(
  "/kurikulum/:kurikulumId",
  kurikulumParamValidation,
  mataKuliahQueryValidation,
  mataKuliahController.getMataKuliahByKurikulumId
);
mataKuliahRouter.get("/:id", idParamValidation, mataKuliahController.getMataKuliahById);
mataKuliahRouter.post("/:kurikulumId", authMiddleware, kurikulumParamValidation, mataKuliahValidation, mataKuliahController.createMataKuliah);
mataKuliahRouter.put("/:id", authMiddleware, idParamValidation, mataKuliahValidation, mataKuliahController.updateMataKuliah);
mataKuliahRouter.delete("/:id", authMiddleware, idParamValidation, mataKuliahController.deleteMataKuliah);

export default mataKuliahRouter;

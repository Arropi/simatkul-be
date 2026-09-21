import { Router } from "express";
import * as mataKuliahController from "../../controllers/master-data/mata-kuliah-controller.js";
import {
  mataKuliahValidation,
  mataKuliahQueryValidation,
  idParamValidation,
  kurikulumParamValidation,
} from "../../validation/master-data-validation.js";

const mataKuliahRouter = Router();

mataKuliahRouter.get("/", mataKuliahController.getAllMataKuliah);
mataKuliahRouter.get(
  "/kurikulum/:kurikulumId",
  kurikulumParamValidation,
  mataKuliahQueryValidation,
  mataKuliahController.getMataKuliahByKurikulumId
);
mataKuliahRouter.get("/:id", idParamValidation, mataKuliahController.getMataKuliahById);
mataKuliahRouter.post("/:kurikulumId", kurikulumParamValidation, mataKuliahValidation, mataKuliahController.createMataKuliah);
mataKuliahRouter.put("/:id", idParamValidation, mataKuliahValidation, mataKuliahController.updateMataKuliah);
mataKuliahRouter.delete("/:id", idParamValidation, mataKuliahController.deleteMataKuliah);

export default mataKuliahRouter;

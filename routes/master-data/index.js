import { Router } from "express";
import dosenRouter from "./dosen-route.js";
import kelasRouter from "./kelas-route.js";
import kurikulumRouter from "./kurikulum-route.js";
import mataKuliahRouter from "./mata-kuliah-route.js";
import ruangRouter from "./ruang-route.js";
import sesiRouter from "./sesi-route.js";

const masterDataRouter = Router();

masterDataRouter.use("/dosen", dosenRouter);
masterDataRouter.use("/kelas", kelasRouter);
masterDataRouter.use("/kurikulum", kurikulumRouter);
masterDataRouter.use("/mata-kuliah", mataKuliahRouter);
masterDataRouter.use("/ruang", ruangRouter);
masterDataRouter.use("/sesi", sesiRouter);

export default masterDataRouter;

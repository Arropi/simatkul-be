import * as penjadwalanService from "../../services/penjadwalan/penjadwalan-service.js";

export async function getFormOptions(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await penjadwalanService.getFormOptionsService(kurikulumId);
    res.status(200).json({
      message: "Data form options penjadwalan berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createPenjadwalan(req, res, next) {
  try {
    const kurikulumId = req.params.kurikulumId;
    const data = await penjadwalanService.createPenjadwalanService(req.body, kurikulumId);
    res.status(201).json({
      message: "Data penjadwalan berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}

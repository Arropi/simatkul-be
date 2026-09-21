import * as sesiService from "../../services/master-data/sesi-service.js";

export async function getAllSesi(req, res, next) {
  try {
    const kurikulumId = req.query.kurikulum_id || req.query.kurikulumId;
    const data = await sesiService.getAllSesiService(kurikulumId);
    res.status(200).json({
      message: "Data sesi berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSesiByKurikulumId(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await sesiService.getSesiByKurikulumIdService(kurikulumId);
    res.status(200).json({
      message: "Data sesi berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSesiById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await sesiService.getSesiByIdService(id);
    res.status(200).json({
      message: "Data sesi berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSesi(req, res, next) {
  try {
    const kurikulumId =
      req.params.kurikulumId ||
      req.params.kurikulum_id ||
      req.body.kurikulum_id ||
      req.body.kurikulumId ||
      req.query.kurikulum_id ||
      req.query.kurikulumId;

    const data = await sesiService.createSesiService(req.body, kurikulumId);
    res.status(201).json({
      message: "Data sesi berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSesi(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await sesiService.updateSesiService(id, req.body);
    res.status(200).json({
      message: "Data sesi berhasil diperbarui",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSesi(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await sesiService.deleteSesiService(id);
    res.status(200).json({
      message: "Data sesi berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

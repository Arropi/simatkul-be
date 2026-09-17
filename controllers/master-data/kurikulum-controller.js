import * as kurikulumService from "../../services/master-data/kurikulum-service.js";

export async function getAllKurikulum(req, res, next) {
  try {
    const data = await kurikulumService.getAllKurikulumService();
    res.status(200).json({
      message: "Data kurikulum berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getKurikulumById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await kurikulumService.getKurikulumByIdService(id);
    res.status(200).json({
      message: "Data kurikulum berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createKurikulum(req, res, next) {
  try {
    const data = await kurikulumService.createKurikulumService(req.body);
    res.status(201).json({
      message: "Data kurikulum berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateKurikulum(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await kurikulumService.updateKurikulumService(id, req.body);
    res.status(200).json({
      message: "Data kurikulum berhasil diperbarui",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteKurikulum(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await kurikulumService.deleteKurikulumService(id);
    res.status(200).json({
      message: "Data kurikulum berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

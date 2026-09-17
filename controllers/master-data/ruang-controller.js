import * as ruangService from "../../services/master-data/ruang-service.js";

export async function getAllRuang(req, res, next) {
  try {
    const data = await ruangService.getAllRuangService();
    res.status(200).json({
      message: "Data ruang berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRuangById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await ruangService.getRuangByIdService(id);
    res.status(200).json({
      message: "Data ruang berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createRuang(req, res, next) {
  try {
    const data = await ruangService.createRuangService(req.body);
    res.status(201).json({
      message: "Data ruang berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRuang(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await ruangService.updateRuangService(id, req.body);
    res.status(200).json({
      message: "Data ruang berhasil diperbarui",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRuang(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await ruangService.deleteRuangService(id);
    res.status(200).json({
      message: "Data ruang berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

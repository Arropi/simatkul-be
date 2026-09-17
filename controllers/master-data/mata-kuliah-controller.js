import * as mataKuliahService from "../../services/master-data/mata-kuliah-service.js";

export async function getAllMataKuliah(req, res, next) {
  try {
    const data = await mataKuliahService.getAllMataKuliahService();
    res.status(200).json({
      message: "Data mata kuliah berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMataKuliahById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await mataKuliahService.getMataKuliahByIdService(id);
    res.status(200).json({
      message: "Data mata kuliah berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createMataKuliah(req, res, next) {
  try {
    const data = await mataKuliahService.createMataKuliahService(req.body);
    res.status(201).json({
      message: "Data mata kuliah berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMataKuliah(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await mataKuliahService.updateMataKuliahService(id, req.body);
    res.status(200).json({
      message: "Data mata kuliah berhasil diperbarui",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMataKuliah(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await mataKuliahService.deleteMataKuliahService(id);
    res.status(200).json({
      message: "Data mata kuliah berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

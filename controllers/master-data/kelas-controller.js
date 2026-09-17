import * as kelasService from "../../services/master-data/kelas-service.js";

export async function getAllKelas(req, res, next) {
  try {
    const data = await kelasService.getAllKelasService();
    res.status(200).json({
      message: "Data kelas berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getKelasById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await kelasService.getKelasByIdService(id);
    res.status(200).json({
      message: "Data kelas berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createKelas(req, res, next) {
  try {
    const data = await kelasService.createKelasService(req.body);
    res.status(201).json({
      message: "Data kelas berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateKelas(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await kelasService.updateKelasService(id, req.body);
    res.status(200).json({
      message: "Data kelas berhasil diperbarui",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteKelas(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await kelasService.deleteKelasService(id);
    res.status(200).json({
      message: "Data kelas berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

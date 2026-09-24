import * as dosenService from "../../services/master-data/dosen-service.js";

export async function getAllDosen(req, res, next) {
  try {
    const kurikulumId = req.query.kurikulum_id || req.query.kurikulumId;
    const data = await dosenService.getAllDosenService(kurikulumId);
    res.status(200).json({
      message: "Data dosen berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDosenByKurikulumId(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await dosenService.getDosenByKurikulumIdService(kurikulumId);
    res.status(200).json({
      message: "Data dosen berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDosenById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await dosenService.getDosenByIdService(id);
    res.status(200).json({
      message: "Data dosen berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDosen(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);

    const data = await dosenService.createDosenService(req.body, kurikulumId);
    res.status(201).json({
      message: "Data dosen berhasil ditambahkan",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDosen(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await dosenService.updateDosenService(id, req.body);
    res.status(200).json({
      message: "Data dosen berhasil diperbarui",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDosen(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await dosenService.deleteDosenService(id);
    res.status(200).json({
      message: "Data dosen berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

import * as mataKuliahService from "../../services/master-data/mata-kuliah-service.js";

export async function getAllMataKuliah(req, res, next) {
  try {
    const kurikulumId = req.query.kurikulum_id || req.query.kurikulumId;
    const data = await mataKuliahService.getAllMataKuliahService(kurikulumId);
    res.status(200).json({
      message: "Data mata kuliah berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMataKuliahByKurikulumId(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const query = req.validatedQuery || req.query;
    const { data, pagination } = await mataKuliahService.getMataKuliahByKurikulumIdService(kurikulumId, query);
    res.status(200).json({
      message: "Data mata kuliah berhasil diambil",
      data,
      pagination,
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
    const kurikulumId =
      req.params.kurikulumId ||
      req.params.kurikulum_id ||
      req.body.kurikulum_id ||
      req.body.kurikulumId ||
      req.query.kurikulum_id ||
      req.query.kurikulumId;

    const data = await mataKuliahService.createMataKuliahService(req.body, kurikulumId);
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

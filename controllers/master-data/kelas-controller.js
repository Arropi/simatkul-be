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

export async function getKelasByKurikulumId(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await kelasService.getKelasByKurikulumIdService(kurikulumId);
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
    const kurikulumId = req.params.kurikulumId

    const data = await kelasService.createKelasService(req.body, kurikulumId);
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
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await kelasService.updateKelasService(kurikulumId, req.body);
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
    const kurikulumId = Number(req.params.kurikulumId);
    const semesterVal = req.body?.semester !== undefined ? req.body.semester : req.query?.semester;
    if (semesterVal === undefined || semesterVal === null || semesterVal === "") {
      const err = new Error("Parameter semester wajib diisi");
      err.statusCode = 400;
      return next(err);
    }
    const semester = Number(semesterVal);
    if (isNaN(semester) || semester <= 0) {
      const err = new Error("Parameter semester harus berupa angka integer positif");
      err.statusCode = 400;
      return next(err);
    }
    const data = await kelasService.deleteKelasService(kurikulumId, semester);
    res.status(200).json({
      message: "Data kelas berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

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

export async function getPenjadwalanRuang(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await penjadwalanService.getPenjadwalanRuangService(kurikulumId);
    res.status(200).json({
      message: "Data penjadwalan ruang berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPenjadwalanKelas(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await penjadwalanService.getPenjadwalanKelasService(kurikulumId);
    res.status(200).json({
      message: "Data penjadwalan kelas berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPenjadwalanDosen(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await penjadwalanService.getPenjadwalanDosenService(kurikulumId);
    res.status(200).json({
      message: "Data penjadwalan dosen berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePenjadwalan(req, res, next) {
  try {
    const id = Number(req.params.penjadwalan_id || req.params.id);
    const data = await penjadwalanService.updatePenjadwalanService(id, req.body);
    res.status(200).json({
      message: "Data penjadwalan berhasil diupdate",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePenjadwalan(req, res, next) {
  try {
    const id = Number(req.params.penjadwalan_id || req.params.id);
    const data = await penjadwalanService.deletePenjadwalanService(id);
    res.status(200).json({
      message: "Data penjadwalan berhasil dihapus",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllPenjadwalanByKurikulum(req, res, next) {
  try {
    const kurikulumId = Number(req.params.kurikulumId);
    const data = await penjadwalanService.getPenjadwalanAllByKurikulumService(kurikulumId);
    res.status(200).json({
      message: "Data seluruh penjadwalan berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPenjadwalanByIdFormatted(req, res, next) {
  try {
    const penjadwalanId = Number(
      req.params.penjadwalanId || req.params.penjadwalan_id || req.params.id
    );
    const data = await penjadwalanService.getPenjadwalanByIdFormattedService(penjadwalanId);
    res.status(200).json({
      message: "Data detail jadwal berhasil diambil",
      data,
    });
  } catch (error) {
    next(error);
  }
}



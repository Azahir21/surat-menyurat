const { JABATAN } = require("../../../models");

async function catchStatus(req, res) {
  const { jabatan_id, isRead, latestStatus, persetujuan, isSigned } = req.body;

  const jabatan = await JABATAN.findOne({
    where: { id: jabatan_id },
  });
  const jabatan_atas = await JABATAN.findOne({
    where: { id: jabatan.jabatan_atas_id },
  });
  const isiStatus = [
    "",
    `Di Daftar Tunggu ${jabatan.name}`,
    `Diproses ${jabatan.name}`,
    `Di Daftar Tunggu ${
      jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""
    }`,
    `Diproses ${jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""}`,
    `Ditolak ${jabatan.name}`,
    `Ditolak ${jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""}`,
    "Surat Telah Ditandatangani",
  ];

  const statusMap = {
    [jabatan.id]: !isRead ? isiStatus[3] : isiStatus[2],
  };
  const updatedStatusMap = { ...statusMap };

  if (
    latestStatus == isiStatus[1] ||
    latestStatus == isiStatus[2] ||
    !latestStatus
  ) {
    if (persetujuan) {
      if (persetujuan.toLowerCase().includes(`disetujui`)) {
        updatedStatusMap[jabatan.id] = isiStatus[3];
        if (!jabatan_atas) {
          updatedStatusMap[jabatan.id] = persetujuan;
        }
      } else if (persetujuan.toLowerCase().includes(`ditolak`)) {
        updatedStatusMap[jabatan.id] = isiStatus[5];
      }
    } else if (isSigned) {
      return isiStatus[7];
    }

    if (latestStatus != updatedStatusMap[jabatan.id]) {
      //diproses TU != Disetujui Dekan
      if (persetujuan) {
        return updatedStatusMap[jabatan.id] || "";
      } else if (!persetujuan && !isRead) {
        return updatedStatusMap[jabatan.id] || "";
      }
      return updatedStatusMap[jabatan.id] || "";
    }
  } else {
    return latestStatus;
  }
}

module.exports = catchStatus;

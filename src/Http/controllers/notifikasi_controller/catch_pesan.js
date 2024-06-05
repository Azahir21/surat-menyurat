const { JABATAN, USERS, DAFTAR_SURAT, PRODI } = require("../../../models");

async function catchPesan(req, res) {
  try {
    const { surat_id, jabatan_id, isSign, persetujuan } = req.body;

    const surat = await DAFTAR_SURAT.findOne({
      where: { id: surat_id },
    });
    const user_surat = await USERS.findOne({
      where: { id: surat.user_id },
    });
    const jabatan_surat = await JABATAN.findOne({
      where: { id: user_surat.jabatan_id },
    });
    const prodi_surat = await PRODI.findOne({
      where: { id: user_surat.prodi_id },
    });
    const jabatan_user = await JABATAN.findOne({
      where: { id: jabatan_id },
    });
    const jabatan_atas = await JABATAN.findOne({
      where: { id: jabatan_user.jabatan_atas_id },
    });

    const isiPesan = [
      `Surat dari ${
        user_surat.prodi_id === 1 || !user_surat.prodi_id
          ? jabatan_surat.name
          : prodi_surat.name
      }`,
      `Surat di ${jabatan_atas && jabatan_atas.name ? jabatan_atas.name : ""}`,
      `Surat ditolak ${jabatan_user.name}`,
      `Surat telah ditandatangani`,
    ];

    if (isSign) {
      return isiPesan[3];
    } else if (
      !persetujuan ||
      (persetujuan && persetujuan.toLowerCase().includes(`disetujui`))
    ) {
      if (persetujuan) {
        return isiPesan[1];
      } else {
        return isiPesan[0];
      }
    } else if (persetujuan && persetujuan.toLowerCase().includes(`ditolak`)) {
      return isiPesan[2];
    } else {
      return isiPesan[0];
    }
  } catch (error) {
    console.error("Error:", error);
    return "Terjadi kesalahan";
  }
}

module.exports = catchPesan;

const {
  postAksesSurat,
} = require("../akses_surat_controller/post_akses_surat");

const send = async (req, res) => {
  const { surat_id, jabatan_id, from } = req.body;

  const reqAksesSurat = {
    body: {
      surat_id: surat_id,
      tambah_akses_id: jabatan_id,
      from: from,
    },
  };
  const saveAkses = await postAksesSurat(reqAksesSurat);
  return saveAkses;
};

module.exports = { send };

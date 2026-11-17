// ---------- audit perusahaan ----------

var soal_audit = [
  { bagian: "PERIZINAN", tanya: "Apakah PT memiliki izin usaha pertambangan?", jenis: "pilih", k: "izin", pilihan: [["ya", "Ya"], ["tidak", "Tidak"]] },
  { bagian: "LINGKUNGAN", tanya: "Berapa hektare kawasan hutan yang dipakai?", jenis: "angka", k: "hektare", satuan: "hektare", awal: "0", ok: nolKeAtas, pesan: "Hektare harus diisi dengan angka dan tidak boleh negatif" },
  { bagian: "KESELAMATAN", tanya: "Berapa korban kecelakaan kerja di wilayah tambang?", jenis: "angka", k: "korban", satuan: "orang", awal: "0", ok: nolKeAtas, pesan: "Jumlah korban harus diisi dengan angka dan tidak boleh negatif" },
  { bagian: "LINGKUNGAN", tanya: "Adakah limbah yang dikelola tanpa izin?", jenis: "pilih", k: "limbah", pilihan: ya_tidak },
  { bagian: "TATA KELOLA", tanya: "Adakah praktik suap dan laporan keuangan fiktif?", jenis: "pilih", k: "suap", pilihan: ya_tidak }
];

function hasilAudit() {
  var denda_min = 0;
  var denda_maks = 0;
  var penjara_min = 0;
  var penjara_maks = 0;
  var saran = [];

  var hektare = parseInt(jawab.hektare);
  var korban = parseInt(jawab.korban);

  // izin usaha pertambangan
  if (jawab.izin == "tidak") {
    denda_maks = denda_maks + 100;
    denda_min = denda_min + 5;
    penjara_min = penjara_min + 2;
    penjara_maks = penjara_maks + 5;
    saran.push(["Tidak punya izin usaha pertambangan", "Hentikan kegiatan dan urus izin usaha pertambangan sebelum beroperasi lagi."]);
  }

  // kawasan hutan
  if (hektare > 1) {
    denda_maks = denda_maks + 5;
    denda_min = denda_min + 1.5;
    penjara_min = penjara_min + 3;
    penjara_maks = penjara_maks + 10;
    saran.push(["Memakai kawasan hutan " + hektare + " hektare", "Urus izin penggunaan kawasan hutan dan siapkan rehabilitasi lahan."]);
  }

  // korban kecelakaan kerja
  if (korban >= 1) {
    denda_maks = denda_maks + 9 * korban;
    denda_min = denda_min + 2 * korban;
    saran.push(["Ada " + korban + " korban kecelakaan kerja", "Evaluasi sistem keselamatan kerja dan pastikan korban mendapat santunan."]);
  }

  // limbah tanpa izin
  if (jawab.limbah == "ya") {
    denda_maks = denda_maks + 5;
    denda_min = denda_min + 1;
    penjara_min = penjara_min + 1;
    penjara_maks = penjara_maks + 5;
    saran.push(["Limbah dikelola tanpa izin", "Urus izin pengelolaan limbah dan pakai pengelola yang berizin."]);
  }

  // suap dan laporan keuangan fiktif
  if (jawab.suap == "ya") {
    denda_maks = denda_maks + 5;
    denda_min = denda_min + 1;
    penjara_min = penjara_min + 1;
    penjara_maks = penjara_maks + 5;
    saran.push(["Suap dan laporan keuangan fiktif", "Lakukan audit keuangan independen dan bangun sistem pelaporan yang transparan."]);
  }

  var tampil;
  if (saran.length == 0) {
    saran.push(["Tidak ada pelanggaran", "Pertahankan kepatuhan dan lakukan audit berkala."]);
    tampil = '<div class="badge b-ok">Tidak ada pelanggaran terdeteksi</div>';
  } else {
    tampil =
      '<div class="big" style="font-size:clamp(36px,8vw,64px)">' + denda_min + " - " + denda_maks + "</div>" +
      '<div class="sub">miliar rupiah (denda minimum - maksimum)</div>' +
      '<div class="badge b-bad">Pidana penjara ' + penjara_min + " - " + penjara_maks + " tahun</div>" +
      '<p class="sub">' + saran.length + " jenis pelanggaran terdeteksi</p>";
  }

  return {
    ringkas: '<div class="bagian">Hasil</div><div class="sub">Akumulasi sanksi perusahaan</div>' + tampil,
    detail:
      "<tr><th>Akumulasi</th><th>Nilai</th></tr>" +
      "<tr><td>Denda maksimum</td><td>" + denda_maks + " miliar rupiah</td></tr>" +
      "<tr><td>Denda minimum</td><td>" + denda_min + " miliar rupiah</td></tr>" +
      "<tr><td>Pidana penjara maksimum</td><td>" + penjara_maks + " tahun</td></tr>" +
      "<tr><td>Pidana penjara minimum</td><td>" + penjara_min + " tahun</td></tr>",
    saran: saran
  };
}

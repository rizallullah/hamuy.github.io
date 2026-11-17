// ---------- audit perusahaan ----------

function hitungAudit() {
  var err = ambil("audit-err");
  var hasilDiv = ambil("audit-hasil");
  err.textContent = "";
  hasilDiv.innerHTML = "";

  var denda_min = 0;
  var denda_maks = 0;
  var penjara_min = 0;
  var penjara_maks = 0;

  var hektare = parseInt(ambil("hektare").value);
  var korban = parseInt(ambil("korban").value);

  if (isNaN(hektare) || isNaN(korban)) {
    err.textContent = "Hektare dan jumlah korban harus diisi dengan angka";
    return;
  }

  // izin usaha pertambangan
  if (ambil("izin").value == "tidak") {
    denda_maks = denda_maks + 100;
    denda_min = denda_min + 5;
    penjara_min = penjara_min + 2;
    penjara_maks = penjara_maks + 5;
  }

  // kawasan hutan
  if (hektare > 1) {
    denda_maks = denda_maks + 5;
    denda_min = denda_min + 1.5;
    penjara_min = penjara_min + 3;
    penjara_maks = penjara_maks + 10;
  }

  // korban kecelakaan kerja
  if (korban >= 1) {
    denda_maks = denda_maks + 9 * korban;
    denda_min = denda_min + 2 * korban;
  }

  // limbah tanpa izin
  if (ambil("limbah").value == "ya") {
    denda_maks = denda_maks + 5;
    denda_min = denda_min + 1;
    penjara_min = penjara_min + 1;
    penjara_maks = penjara_maks + 5;
  }

  // suap dan laporan keuangan fiktif
  if (ambil("suap").value == "ya") {
    denda_maks = denda_maks + 5;
    denda_min = denda_min + 1;
    penjara_min = penjara_min + 1;
    penjara_maks = penjara_maks + 5;
  }

  hasilDiv.innerHTML =
    '<div class="hasil"><div class="panel"><table>' +
    "<tr><th>Akumulasi</th><th>Nilai</th></tr>" +
    "<tr><td>Denda maksimum</td><td>" + denda_maks + " miliar rupiah</td></tr>" +
    "<tr><td>Denda minimum</td><td>" + denda_min + " miliar rupiah</td></tr>" +
    "<tr><td>Pidana penjara maksimum</td><td>" + penjara_maks + " tahun</td></tr>" +
    "<tr><td>Pidana penjara minimum</td><td>" + penjara_min + " tahun</td></tr>" +
    "</table></div></div>";
}

// ---------- pengecekan kualitas air ----------

function hitungAir() {
  var err = ambil("air-err");
  var hasilDiv = ambil("air-hasil");
  err.textContent = "";
  hasilDiv.innerHTML = "";

  var jenis_tambang = parseInt(ambil("tambang").value);
  var tambang = jenis_tambang == 1 ? "Nikel" : "Batu Bara";

  // bagian pengamatan awal
  var poin = 0;
  if (ambil("keruh").value == "ya") poin = poin + 1;
  if (ambil("warna").value == "ya") poin = poin + 1;
  if (ambil("bau").value == "ya") poin = poin + 1;

  // poin 0 = layak, 1 = cukup layak, 2 = kurang layak, 3 = tidak layak
  var hasil;
  if (poin == 0) {
    hasil = "Air Layak Guna";
  } else if (poin == 1) {
    hasil = "Air Cukup Layak Guna";
  } else if (poin == 2) {
    hasil = "Air Kurang Layak Guna";
  } else {
    hasil = "Air Tidak Layak Guna";
  }

  // kalau tidak lanjut, tampilkan hasil pengamatan saja
  if (ambil("lanjut").value == "tidak") {
    hasilDiv.innerHTML =
      '<div class="hasil"><div class="panel">' +
      "<p>Jenis Tambang : " + tambang + "</p>" +
      "<p>Hasil Pengamatan : <b>" + hasil + "</b></p>" +
      "</div></div>";
    return;
  }

  // ---------- observasi lebih lanjut ----------
  var jarak = angka("jarak");
  var jumlah_air = angka("jumlah_air");
  var ph = angka("ph");
  var ntu = angka("ntu");
  var tcu = angka("tcu");
  var massa = [angka("massa0"), angka("massa1"), angka("massa2"), angka("massa3")];

  if (adaKosong([jarak, jumlah_air, ph, ntu, tcu]) || adaKosong(massa)) {
    err.textContent = "Semua kolom observasi harus diisi dengan angka";
    return;
  }
  if (jarak < 0) {
    err.textContent = "Jarak harus Positif";
    return;
  }
  if (jumlah_air <= 0) {
    err.textContent = "Jumlah air harus lebih dari nol (> 0)";
    return;
  }
  if (ph < 0 || ph > 14) {
    err.textContent = "Nilai pH harus dalam rentang 0 - 14";
    return;
  }
  if (ntu < 0) {
    err.textContent = "Nilai NTU harus lebih dari atau sama dengan nol (NTU >= 0)";
    return;
  }
  if (tcu <= 0) {
    err.textContent = "Nilai TCU harus lebih dari nol (TCU > 0)";
    return;
  }
  for (var m = 0; m < 4; m++) {
    if (massa[m] < 0) {
      err.textContent = "Massa tidak boleh negatif";
      return;
    }
  }

  var ika = 0; // indeks kelayakan air

  // jarak
  if (jarak > 0.5 && jarak <= 1) {
    ika = ika - 10;
  } else if (jarak >= 0 && jarak <= 0.5) {
    ika = ika - 20;
  } else {
    ika = ika + 10;
  }

  // pH
  var status_ph;
  if (ph > 6.5 && ph < 8.5) {
    status_ph = "pH Ideal, Layak Guna";
    ika = ika + 20;
  } else if ((ph > 5.5 && ph <= 6.5) || (ph >= 8.5 && ph < 9.5)) {
    status_ph = "Sedikit Asam/Basa, Masih Layak";
    ika = ika + 20;
  } else if ((ph > 3.5 && ph <= 5.5) || (ph >= 9.5 && ph < 11.5)) {
    status_ph = "Asam/Basa, Kurang Layak";
    ika = ika + 10;
  } else if ((ph > 2 && ph <= 3.5) || (ph >= 11.5 && ph < 13)) {
    status_ph = "Asam/Basa Kuat, Tidak Layak";
    ika = ika - 10;
  } else {
    status_ph = "Sangat Asam/Basa, Berbahaya";
    ika = ika - 20;
  }

  // pH yang skornya negatif dianggap berbahaya
  var ph_berbahaya = ph <= 3.5 || ph >= 11.5;

  // NTU
  var status_ntu;
  if (ntu <= 1) {
    status_ntu = "Air Sangat Jernih";
    ika = ika + 20;
  } else if (ntu <= 5) {
    status_ntu = "Sedikit Keruh, Masih Layak";
    ika = ika + 20;
  } else if (ntu <= 25) {
    status_ntu = "Layak guna, tak layak minum";
    ika = ika + 10;
  } else {
    status_ntu = "Tidak layak guna";
  }

  // TCU
  var status_tcu;
  if (tcu <= 5) {
    status_tcu = "Air Jernih/Tak Berwarna";
    ika = ika + 10;
  } else if (tcu <= 15) {
    status_tcu = "Sedikit Berwarna, Masih Layak";
    ika = ika + 10;
  } else if (tcu <= 50) {
    status_tcu = "Berwarna Sedang, Tak Layak Minum";
  } else {
    status_tcu = "Tidak Layak Guna";
  }

  // zat terlarut, konsentrasi (mg/L) = massa (mg) / volume (liter)
  var nama = nama_zat[jenis_tambang];
  var batas = batas_zat[jenis_tambang];
  var kons_zat = [];
  var status_zat = [];
  var total_massa = 0;
  var ada_melebihi = false;

  for (var i = 0; i < 4; i++) {
    total_massa = total_massa + massa[i];
    var konsentrasi = massa[i] / jumlah_air;
    kons_zat.push(konsentrasi);
    if (konsentrasi <= batas[i]) {
      status_zat.push("Layak Guna");
      ika = ika + 10;
    } else {
      status_zat.push("Tidak Layak Guna");
      ada_melebihi = true;
    }
  }

  // kalau ada zat yang melebihi batas, IKA = 0
  if (ada_melebihi) {
    ika = 0;
  }

  // TDS total (mg/L)
  var tds = total_massa / jumlah_air;
  var status_tds;
  if (tds < 100) {
    status_tds = "Sangat Rendah";
  } else if (tds < 300) {
    status_tds = "Sangat Baik (Ideal)";
  } else if (tds < 600) {
    status_tds = "Baik";
  } else if (tds < 1000) {
    status_tds = "Sedang";
  } else if (tds <= 3000) {
    status_tds = "Buruk";
  } else {
    status_tds = "Sangat Buruk";
  }

  // kesimpulan akhir
  var kategori;
  if (ph_berbahaya) {
    kategori = "AIR TIDAK LAYAK GUNA (pH berbahaya)";
  } else if (ntu > 25) {
    kategori = "AIR TIDAK LAYAK GUNA (NTU > 25)";
  } else if (tcu > 50) {
    kategori = "AIR TIDAK LAYAK GUNA (TCU > 50)";
  } else if (ada_melebihi) {
    kategori = "AIR TIDAK LAYAK GUNA (ada zat melebihi batas)";
  } else if (ika >= 100) {
    kategori = "AIR LAYAK DIGUNAKAN";
  } else if (ika >= 80) {
    kategori = "AIR CUKUP LAYAK DIGUNAKAN";
  } else if (ika >= 60) {
    kategori = "AIR KURANG LAYAK GUNA";
  } else {
    kategori = "AIR TIDAK LAYAK GUNA";
  }

  var warna = "bad";
  if (kategori == "AIR LAYAK DIGUNAKAN" || kategori == "AIR CUKUP LAYAK DIGUNAKAN") {
    warna = "ok";
  } else if (kategori == "AIR KURANG LAYAK GUNA") {
    warna = "mid";
  }

  // tampilkan hasil
  var baris_zat = "";
  for (var j = 0; j < 4; j++) {
    var kelas = status_zat[j] == "Layak Guna" ? "p-ok" : "p-bad";
    baris_zat +=
      "<tr><td>" + nama[j] + "</td>" +
      "<td>" + kons_zat[j].toFixed(4) + " mg/L (batas " + batas[j] + ")</td>" +
      '<td><span class="pill ' + kelas + '">' + status_zat[j] + "</span></td></tr>";
  }

  hasilDiv.innerHTML =
    '<div class="hasil">' +
    '<div class="big">' + ika + ' <small style="font-size:.3em">/ 100</small></div>' +
    '<div class="badge b-' + warna + '">' + kategori + "</div>" +
    '<div class="panel"><table>' +
    "<tr><th>Parameter</th><th>Nilai</th><th>Status</th></tr>" +
    "<tr><td>Jenis tambang</td><td>" + tambang + "</td><td></td></tr>" +
    "<tr><td>Jumlah air</td><td>" + jumlah_air + " liter</td><td></td></tr>" +
    "<tr><td>Pengamatan awal</td><td></td><td>" + hasil + "</td></tr>" +
    "<tr><td>pH</td><td>" + ph + "</td><td>" + status_ph + "</td></tr>" +
    "<tr><td>NTU</td><td>" + ntu + "</td><td>" + status_ntu + "</td></tr>" +
    "<tr><td>TCU</td><td>" + tcu + "</td><td>" + status_tcu + "</td></tr>" +
    baris_zat +
    "<tr><td>TDS Total</td><td>" + tds.toFixed(2) + " mg/L</td><td>" + status_tds + "</td></tr>" +
    "</table></div></div>";
}

// ---------- pengecekan kualitas air ----------

// poin 0 = layak, 1 = cukup layak, 2 = kurang layak, 3 = tidak layak
function poinAwal() {
  var poin = 0;
  if (jawab.keruh == "ya") poin = poin + 1;
  if (jawab.warna == "ya") poin = poin + 1;
  if (jawab.bau == "ya") poin = poin + 1;
  return poin;
}

function teksPengamatan(poin) {
  if (poin == 0) {
    return "Air Layak Guna";
  } else if (poin == 1) {
    return "Air Cukup Layak Guna";
  } else if (poin == 2) {
    return "Air Kurang Layak Guna";
  } else {
    return "Air Tidak Layak Guna";
  }
}

// kolom massa tiap zat, namanya ikut jenis tambang
function daftarMassa() {
  var nama = nama_zat[parseInt(jawab.tambang)];
  var daftar = [];
  for (var i = 0; i < 4; i++) {
    daftar.push({ k: "massa" + i, label: "Massa " + nama[i] + " (mg)" });
  }
  return daftar;
}

var soal_air = [
  { bagian: "TAMBANG", tanya: "Jenis tambang apa yang ingin diuji?", jenis: "pilih", k: "tambang", pilihan: [["1", "Nikel"], ["2", "Batu Bara"]] },
  { bagian: "PENGAMATAN", tanya: "Apakah air terlihat keruh?", jenis: "pilih", k: "keruh", pilihan: ya_tidak },
  { bagian: "PENGAMATAN", tanya: "Apakah air berwarna?", jenis: "pilih", k: "warna", pilihan: ya_tidak },
  { bagian: "PENGAMATAN", tanya: "Apakah air berbau?", jenis: "pilih", k: "bau", pilihan: ya_tidak },
  {
    bagian: "PENGAMATAN", tanya: "Mau observasi lebih lanjut?", jenis: "pilih", k: "lanjut", pilihan: ya_tidak,
    sub: function () {
      return "Hasil pengamatan awal: " + teksPengamatan(poinAwal()) + ". Observasi lanjutan mengukur jarak, pH, NTU, TCU, dan zat terlarut.";
    }
  },
  { bagian: "LOKASI", tanya: "Berapa jarak sumber air dari area tambang?", jenis: "slider", k: "jarak", min: 0, max: 10, step: 0.1, satuan: "km", awal: 2, kiri: "DEKAT", kanan: "JAUH", ok: nolKeAtas, pesan: "Jarak harus Positif" },
  { bagian: "LOKASI", tanya: "Berapa jumlah air yang diobservasi?", jenis: "angka", k: "jumlah_air", satuan: "liter", awal: "", ok: diAtasNol, pesan: "Jumlah air harus lebih dari nol (> 0)" },
  { bagian: "KIMIA", tanya: "Berapa nilai pH air?", jenis: "slider", k: "ph", min: 0, max: 14, step: 0.1, satuan: "", awal: 7, kiri: "ASAM", kanan: "BASA", ok: phWajar, pesan: "Nilai pH harus dalam rentang 0 - 14" },
  { bagian: "KIMIA", tanya: "Berapa nilai kekeruhan (NTU)?", jenis: "slider", k: "ntu", min: 0, max: 100, step: 0.5, satuan: "NTU", awal: 1, kiri: "JERNIH", kanan: "KERUH", ok: nolKeAtas, pesan: "Nilai NTU harus lebih dari atau sama dengan nol (NTU >= 0)" },
  { bagian: "KIMIA", tanya: "Berapa tingkat warna air (TCU)?", jenis: "slider", k: "tcu", min: 0.1, max: 100, step: 0.1, satuan: "TCU", awal: 5, kiri: "BENING", kanan: "PEKAT", ok: diAtasNol, pesan: "Nilai TCU harus lebih dari nol (TCU > 0)" },
  { bagian: "ZAT TERLARUT", tanya: "Berapa massa tiap zat terlarut?", jenis: "banyak", daftar: daftarMassa, negatif: "Massa tidak boleh negatif" }
];

function hasilAir() {
  var jenis_tambang = parseInt(jawab.tambang);
  var tambang = jenis_tambang == 1 ? "Nikel" : "Batu Bara";
  var hasil = teksPengamatan(poinAwal());
  var saran = [];

  // kalau tidak lanjut, tampilkan hasil pengamatan saja
  if (jawab.lanjut == "tidak") {
    saran.push(["Lakukan observasi lebih lanjut", "Pengamatan visual saja belum cukup. Ukur pH, NTU, TCU, dan kadar zat terlarut."]);
    if (jawab.bau == "ya") {
      saran.push(["Air berbau", "Coba aerasi atau filtrasi karbon aktif, lalu telusuri sumber bahan organik atau sulfida."]);
    }
    return {
      ringkas:
        '<div class="bagian">Hasil</div>' +
        '<div class="sub">Jenis tambang: ' + tambang + "</div>" +
        '<div class="big" style="font-size:44px;margin-top:10px">' + hasil + "</div>" +
        '<p class="sub">Ini baru penilaian visual, skor IKA butuh observasi lebih lanjut.</p>',
      detail:
        "<tr><th>Pengamatan</th><th>Jawaban</th></tr>" +
        "<tr><td>Keruh</td><td>" + jawab.keruh + "</td></tr>" +
        "<tr><td>Berwarna</td><td>" + jawab.warna + "</td></tr>" +
        "<tr><td>Berbau</td><td>" + jawab.bau + "</td></tr>",
      saran: saran
    };
  }

  // ---------- observasi lebih lanjut ----------
  var jarak = parseFloat(jawab.jarak);
  var jumlah_air = parseFloat(jawab.jumlah_air);
  var ph = parseFloat(jawab.ph);
  var ntu = parseFloat(jawab.ntu);
  var tcu = parseFloat(jawab.tcu);
  var massa = [];
  for (var m = 0; m < 4; m++) {
    massa.push(parseFloat(jawab["massa" + m]));
  }

  var ika = 0; // indeks kelayakan air

  // jarak
  var status_jarak;
  if (jarak > 0.5 && jarak <= 1) {
    status_jarak = "Dekat dengan tambang";
    ika = ika - 10;
  } else if (jarak >= 0 && jarak <= 0.5) {
    status_jarak = "Sangat dekat dengan tambang";
    ika = ika - 20;
  } else {
    status_jarak = "Jarak aman";
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
  var zat_melebihi = [];
  var total_massa = 0;

  for (var i = 0; i < 4; i++) {
    total_massa = total_massa + massa[i];
    var konsentrasi = massa[i] / jumlah_air;
    kons_zat.push(konsentrasi);
    if (konsentrasi <= batas[i]) {
      status_zat.push("Layak Guna");
      ika = ika + 10;
    } else {
      status_zat.push("Tidak Layak Guna");
      zat_melebihi.push(nama[i]);
    }
  }

  // kalau ada zat yang melebihi batas, IKA = 0
  var ada_melebihi = zat_melebihi.length > 0;
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

  // ---------- saran ----------
  if (jarak <= 1) {
    saran.push(["Sumber air dekat tambang", "Pantau lebih sering dan pertimbangkan sumber air lain yang lebih jauh."]);
  }
  if (ph_berbahaya) {
    saran.push(["pH berbahaya (" + ph + ")", "Netralisasi dulu: kapur untuk air asam, asam lemah untuk air basa. Jangan dipakai sebelum pH normal."]);
  } else if (ph <= 6.5 || ph >= 8.5) {
    saran.push(["pH di luar ideal", "Lakukan penyesuaian pH ringan, targetnya 6.5 - 8.5."]);
  }
  if (ntu > 5) {
    saran.push(["Kekeruhan tinggi (" + ntu + " NTU)", "Pakai kolam pengendapan, koagulasi (tawas atau PAC), lalu filtrasi pasir."]);
  }
  if (tcu > 15) {
    saran.push(["Warna air pekat (" + tcu + " TCU)", "Koagulasi, oksidasi, dan karbon aktif untuk mengurangi warna."]);
  }
  for (var s = 0; s < 4; s++) {
    if (status_zat[s] != "Layak Guna") {
      saran.push([
        nama[s] + " melebihi batas",
        "Konsentrasi " + kons_zat[s].toFixed(3) + " mg/L, batasnya " + batas[s] + " mg/L. " + saran_zat[nama[s].split(" ")[0]]
      ]);
    }
  }
  if (tds >= 600) {
    saran.push(["TDS tinggi (" + tds.toFixed(0) + " mg/L)", "Pertimbangkan reverse osmosis atau diencerkan dengan air bersih."]);
  }
  if (saran.length == 0) {
    saran.push(["Kondisi baik", "Pertahankan dan pantau berkala, misalnya tiap bulan atau setelah hujan deras."]);
  }

  // ---------- tampilan ----------
  var catatan = "";
  if (ada_melebihi) {
    catatan =
      '<div class="panel" style="max-width:560px"><b>Kenapa IKA = 0?</b><br>' +
      "Ada zat terlarut yang melebihi batas, jadi IKA otomatis jadi 0. Zat yang melebihi: <b>" +
      zat_melebihi.join(", ") + "</b>.</div>";
  }

  var baris_zat = "";
  for (var j = 0; j < 4; j++) {
    var kelas = status_zat[j] == "Layak Guna" ? "p-ok" : "p-bad";
    baris_zat +=
      "<tr><td>" + nama[j] + "</td>" +
      "<td>" + kons_zat[j].toFixed(4) + " mg/L (batas " + batas[j] + ")</td>" +
      '<td><span class="pill ' + kelas + '">' + status_zat[j] + "</span></td></tr>";
  }

  return {
    ringkas:
      '<div class="bagian">Hasil</div>' +
      '<div class="sub">Indeks Kelayakan Air (' + tambang + ")</div>" +
      '<div class="big">' + ika + " <small>/ 100</small></div>" +
      '<div class="badge b-' + warna + '">' + kategori + "</div>" +
      '<p class="sub">Pengamatan awal: ' + hasil + "</p>" + catatan,
    detail:
      "<tr><th>Parameter</th><th>Nilai</th><th>Status</th></tr>" +
      "<tr><td>Jarak ke tambang</td><td>" + jarak + " km</td><td>" + status_jarak + "</td></tr>" +
      "<tr><td>Jumlah air</td><td>" + jumlah_air + " liter</td><td></td></tr>" +
      "<tr><td>pH</td><td>" + ph + "</td><td>" + status_ph + "</td></tr>" +
      "<tr><td>NTU</td><td>" + ntu + "</td><td>" + status_ntu + "</td></tr>" +
      "<tr><td>TCU</td><td>" + tcu + "</td><td>" + status_tcu + "</td></tr>" +
      baris_zat +
      "<tr><td>TDS Total</td><td>" + tds.toFixed(2) + " mg/L</td><td>" + status_tds + "</td></tr>",
    saran: saran
  };
}

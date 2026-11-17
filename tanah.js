// ---------- pencemaran tanah (indeks Nemerow / Pn) ----------

// untuk logam berat: <= a -> 0, <= b -> 0.2, selebihnya 0.7
function poinLogam(nilai, a, b) {
  if (nilai <= a) return 0;
  if (nilai <= b) return 0.2;
  return 0.7;
}

// logam berat yang ditanya, Pb selalu ada, sisanya ikut jenis tambang
function daftarLogam() {
  var daftar = [{ k: "klb", nama: "Pb", label: "Logam berat Pb (g/kg)" }];
  if (jawab.tambang == "2") {
    daftar.push({ k: "klbf", nama: "Fe", label: "Logam berat Fe (g/kg)" });
    daftar.push({ k: "klbm", nama: "Mn", label: "Logam berat Mn (g/kg)" });
    daftar.push({ k: "klbso4", nama: "SO4", label: "Logam berat SO4 (g/kg)" });
  } else {
    daftar.push({ k: "klbni", nama: "Ni", label: "Logam berat Ni (g/kg)" });
    daftar.push({ k: "klbco", nama: "Co", label: "Logam berat Co (g/kg)" });
    daftar.push({ k: "klbcr6", nama: "Cr6+", label: "Logam berat Cr6+ (g/kg)" });
  }
  return daftar;
}

var soal_tanah = [
  { bagian: "TAMBANG", tanya: "Jenis tambang apa yang ingin diuji?", jenis: "pilih", k: "tambang", pilihan: [["1", "Nikel"], ["2", "Batu Bara"]] },
  { bagian: "SIFAT TANAH", tanya: "Berapa pH tanah?", jenis: "slider", k: "pht", min: 0, max: 14, step: 0.1, satuan: "", awal: 7, kiri: "ASAM", kanan: "BASA", ok: phWajar, pesan: "Nilai pH harus dalam rentang 0 - 14" },
  { bagian: "SIFAT TANAH", tanya: "Berapa daya hantar listrik tanah?", jenis: "angka", k: "ec", satuan: "dS/m", awal: "", ok: nolKeAtas, pesan: "Nilai harus lebih dari atau sama dengan nol" },
  { bagian: "SIFAT TANAH", tanya: "Berapa C-Organik dalam 1 kg tanah?", jenis: "angka", k: "corg", satuan: "%", awal: "", ok: nolKeAtas, pesan: "Nilai harus lebih dari atau sama dengan nol" },
  { bagian: "SIFAT TANAH", tanya: "Berapa kapasitas tukar kation?", jenis: "angka", k: "ktk", satuan: "cmol/kg", awal: "", ok: nolKeAtas, pesan: "Nilai harus lebih dari atau sama dengan nol" },
  { bagian: "LOGAM BERAT", tanya: "Berapa kadar tiap logam berat?", jenis: "banyak", daftar: daftarLogam, negatif: "Nilai harus lebih dari atau sama dengan nol" }
];

function hasilTanah() {
  var jenis_tambang = parseInt(jawab.tambang);
  var tambang = jenis_tambang == 1 ? "Nikel" : "Batu Bara";

  var pht = parseFloat(jawab.pht);
  var ec = parseFloat(jawab.ec);
  var corg = parseFloat(jawab.corg);
  var ktk = parseFloat(jawab.ktk);

  var pn = 0;
  var rincian = "";
  var saran = [];

  // catat poin tiap parameter, kalau poin > 0 masuk ke saran
  function catat(nama, nilai, p, tips) {
    pn = pn + p;
    rincian += "<tr><td>" + nama + "</td><td>" + nilai + "</td><td>" + p + "</td></tr>";
    if (p > 0) {
      saran.push([nama + " (" + nilai + ")", tips]);
    }
  }

  // pH tanah
  var p_ph;
  if (pht <= 4.5) {
    p_ph = 0.7;
  } else if (pht <= 5.5) {
    p_ph = 0.2;
  } else if (pht <= 8.5) {
    p_ph = 0;
  } else if (pht <= 9.5) {
    p_ph = 0.2;
  } else {
    p_ph = 0.7;
  }
  var tips_ph = pht < 7 ? "Tanah terlalu asam, lakukan pengapuran (kapur dolomit)." : "Tanah terlalu basa, tambahkan bahan organik atau belerang.";
  catat("pH tanah", pht, p_ph, tips_ph);

  // daya hantar listrik
  var p_ec;
  if (ec <= 2) {
    p_ec = 0;
  } else if (ec <= 4) {
    p_ec = 0.2;
  } else {
    p_ec = 0.7;
  }
  catat("Daya hantar listrik", ec + " dS/m", p_ec, "Garam terlarut tinggi, lakukan pencucian tanah dan perbaiki drainase.");

  // c-organik
  var p_corg;
  if (corg <= 2) {
    p_corg = 0.7;
  } else if (corg <= 5) {
    p_corg = 0.2;
  } else {
    p_corg = 0;
  }
  catat("C-Organik", corg + " %", p_corg, "Tambahkan kompos atau pupuk kandang dan tanam penutup tanah.");

  // kapasitas tukar kation
  var p_ktk;
  if (ktk <= 5) {
    p_ktk = 0.7;
  } else if (ktk <= 20) {
    p_ktk = 0.2;
  } else {
    p_ktk = 0;
  }
  catat("Kapasitas tukar kation", ktk + " cmol/kg", p_ktk, "Tambahkan bahan organik atau zeolit untuk menaikkan KTK.");

  // logam berat, batas [a, b] urutannya sama dengan daftarLogam()
  var logam = daftarLogam();
  var ambang;
  if (jenis_tambang == 2) {
    // Pb, Fe, Mn, SO4
    ambang = [[1.5, 6], [100, 250], [5, 18], [1.5, 3]];
  } else {
    // Pb, Ni, Co, Cr6+
    ambang = [[1.5, 6], [0.5, 2.1], [0.3, 2.4], [0.075, 0.25]];
  }
  for (var i = 0; i < logam.length; i++) {
    var nilai = parseFloat(jawab[logam[i].k]);
    var p = poinLogam(nilai, ambang[i][0], ambang[i][1]);
    catat(logam[i].nama, nilai + " g/kg", p, "Kadar melewati batas aman, pertimbangkan fitoremediasi atau penimbunan dengan tanah bersih.");
  }

  var kategori, kelas;
  if (pn <= 0.7) {
    kategori = "Bersih"; kelas = "ok";
  } else if (pn <= 1) {
    kategori = "Cukup Bersih"; kelas = "ok";
  } else if (pn <= 2) {
    kategori = "Tercemar ringan"; kelas = "mid";
  } else if (pn <= 3) {
    kategori = "Tercemar sedang"; kelas = "bad";
  } else {
    kategori = "Tercemar Berat"; kelas = "bad";
  }

  if (saran.length == 0) {
    saran.push(["Kondisi baik", "Semua parameter masih aman, lanjutkan pemantauan berkala."]);
  }

  return {
    ringkas:
      '<div class="bagian">Hasil</div>' +
      '<div class="sub">Indeks Nemerow (Pn), tambang ' + tambang + "</div>" +
      '<div class="big">' + pn.toFixed(2) + "</div>" +
      '<div class="badge b-' + kelas + '">Indeks tanah = ' + kategori + "</div>",
    detail:
      "<tr><th>Parameter</th><th>Nilai</th><th>Poin</th></tr>" +
      rincian +
      "<tr><td><b>Total Pn</b></td><td></td><td><b>" + pn.toFixed(2) + "</b></td></tr>",
    saran: saran
  };
}

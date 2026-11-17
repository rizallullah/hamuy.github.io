// ---------- pengecekan kualitas udara (ISPU) ----------

// batas: nilai <= batas[0] -> 0, <= batas[1] -> 15, <= batas[2] -> 30, <= batas[3] -> 50, selebihnya 100
var param_udara = [
  { k: "pm10", nama: "PM10", max: 600, step: 5, batas: [50, 150, 350, 420] },
  { k: "pm25", nama: "PM2.5", max: 300, step: 1, batas: [15.5, 55.4, 150.4, 250.4] },
  { k: "so2", nama: "SO2", max: 1500, step: 5, batas: [52, 180, 400, 800] },
  { k: "co", nama: "CO", max: 50000, step: 100, batas: [4000, 8000, 15000, 30000] },
  { k: "o3", nama: "O3", max: 1200, step: 5, batas: [120, 235, 400, 800] },
  { k: "no2", nama: "NO2", max: 3500, step: 10, batas: [80, 200, 1130, 2260] },
  { k: "hc", nama: "HC", max: 700, step: 5, batas: [45, 100, 215, 432] }
];

var saran_udara = {
  pm10: "Siram jalan angkut secara berkala, tutup tumpukan material, dan batasi kecepatan kendaraan.",
  pm25: "Kurangi pembakaran terbuka dan emisi mesin diesel, pakai masker N95 di area kerja.",
  so2: "Pasang scrubber di sumber pembakaran batu bara atau smelter, pakai bahan bakar rendah sulfur.",
  co: "Rawat mesin dan kendaraan supaya pembakaran sempurna, perbaiki ventilasi area tertutup.",
  o3: "Batasi aktivitas luar ruangan di siang hari dan kurangi emisi NOx dan HC.",
  no2: "Kurangi emisi kendaraan dan genset, pakai mesin dengan standar emisi lebih baik.",
  hc: "Tutup rapat tangki BBM dan rawat area penyimpanan serta pengisian bahan bakar."
};

function poinUdara(nilai, batas) {
  if (nilai <= batas[0]) return 0;
  if (nilai <= batas[1]) return 15;
  if (nilai <= batas[2]) return 30;
  if (nilai <= batas[3]) return 50;
  return 100;
}

// soal dibuat dari daftar parameter
var soal_udara = [];
for (var u = 0; u < param_udara.length; u++) {
  soal_udara.push({
    bagian: u < 2 ? "PARTIKULAT" : "GAS PENCEMAR",
    tanya: "Berapa konsentrasi " + param_udara[u].nama + "?",
    jenis: "slider",
    k: param_udara[u].k,
    min: 0,
    max: param_udara[u].max,
    step: param_udara[u].step,
    satuan: "µg/m³",
    awal: 0,
    kiri: "BERSIH",
    kanan: "TERCEMAR",
    ok: nolKeAtas,
    pesan: "Nilai " + param_udara[u].nama + " harus lebih dari atau sama dengan nol"
  });
}

function hasilUdara() {
  var ispu = 0;
  var rincian = "";
  var saran = [];
  var tertinggi = 0;
  var poin_tertinggi = 0;

  for (var j = 0; j < param_udara.length; j++) {
    var par = param_udara[j];
    var nilai = parseFloat(jawab[par.k]);
    var p = poinUdara(nilai, par.batas);
    ispu = ispu + p;
    rincian += "<tr><td>" + par.nama + "</td><td>" + nilai + " &micro;g/m&sup3;</td><td>" + p + "</td></tr>";

    if (p > poin_tertinggi) {
      poin_tertinggi = p;
      tertinggi = j;
    }
    if (p >= 30) {
      saran.push([par.nama + " tinggi (" + nilai + " µg/m³)", saran_udara[par.k]]);
    }
  }

  var kategori, warna, teks, keterangan;
  if (ispu <= 50) {
    kategori = "Baik"; warna = "#4cc36b"; teks = "#06301a";
    keterangan = "Kualitas udara baik dan tidak berdampak negatif bagi manusia, hewan, maupun tumbuhan.";
  } else if (ispu <= 100) {
    kategori = "Sedang"; warna = "#4a90e2"; teks = "#fff";
    keterangan = "Tidak berpengaruh pada kesehatan, tapi bisa berpengaruh pada tumbuhan yang sensitif.";
  } else if (ispu <= 200) {
    kategori = "Tidak Sehat"; warna = "#f3c04f"; teks = "#4a3600";
    keterangan = "Merugikan kelompok rentan seperti lansia, anak-anak, dan penderita asma atau jantung.";
  } else if (ispu <= 300) {
    kategori = "Sangat Tidak Sehat"; warna = "#ef4b4b"; teks = "#fff";
    keterangan = "Risiko kesehatan serius bagi sebagian populasi, aktivitas luar ruangan sebaiknya dibatasi.";
  } else {
    kategori = "Berbahaya"; warna = "#111"; teks = "#fff";
    keterangan = "Berbahaya bagi seluruh populasi dan perlu penanganan darurat.";
  }

  saran.unshift([kategori + " (ISPU " + ispu + ")", keterangan]);
  if (ispu > 100) {
    saran.push(["Perlindungan diri", "Kelompok rentan sebaiknya membatasi aktivitas luar ruangan dan memakai masker N95."]);
  }
  if (ispu > 300) {
    saran.push(["Darurat", "Tetap di dalam ruangan dan segera cari bantuan medis kalau sesak napas."]);
  }

  var kritis = "";
  if (poin_tertinggi > 0) {
    kritis = '<p class="sub">Parameter paling berpengaruh: <b>' + param_udara[tertinggi].nama + "</b></p>";
  }

  return {
    ringkas:
      '<div class="bagian">Hasil</div>' +
      '<div class="sub">Indeks Standar Pencemar Udara (ISPU)</div>' +
      '<div class="big">' + ispu + "</div>" +
      '<div class="badge" style="background:' + warna + ";color:" + teks + ';border:2px solid #fff">Indeks ISPU = ' + kategori + "</div>" +
      kritis + '<p class="sub">' + keterangan + "</p>",
    detail:
      "<tr><th>Parameter</th><th>Konsentrasi</th><th>Poin</th></tr>" +
      rincian +
      "<tr><td><b>Total</b></td><td></td><td><b>" + ispu + "</b></td></tr>",
    saran: saran
  };
}

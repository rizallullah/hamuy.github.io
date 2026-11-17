// ---------- pengecekan kualitas udara (ISPU) ----------

// nilai <= batas[0] -> 0, <= batas[1] -> 15, <= batas[2] -> 30, <= batas[3] -> 50, selebihnya 100
function poinUdara(nilai, batas) {
  if (nilai <= batas[0]) return 0;
  if (nilai <= batas[1]) return 15;
  if (nilai <= batas[2]) return 30;
  if (nilai <= batas[3]) return 50;
  return 100;
}

function hitungUdara() {
  var err = ambil("udara-err");
  var hasilDiv = ambil("udara-hasil");
  err.textContent = "";
  hasilDiv.innerHTML = "";

  var pm10 = angka("pm10");
  var pm25 = angka("pm25");
  var so2 = angka("so2");
  var co = angka("co");
  var o3 = angka("o3");
  var no2 = angka("no2");
  var hc = angka("hc");

  if (adaKosong([pm10, pm25, so2, co, o3, no2, hc])) {
    err.textContent = "Semua parameter harus diisi dengan angka";
    return;
  }

  var nama = ["PM10", "PM2.5", "SO2", "CO", "O3", "NO2", "HC"];
  var nilai = [pm10, pm25, so2, co, o3, no2, hc];
  for (var i = 0; i < nilai.length; i++) {
    if (nilai[i] < 0) {
      err.textContent = "Nilai " + nama[i] + " harus lebih dari atau sama dengan nol";
      return;
    }
  }

  var ispu = 0;
  var rincian = "";

  var batas = [
    [50, 150, 350, 420],        // pm10
    [15.5, 55.4, 150.4, 250.4], // pm2.5
    [52, 180, 400, 800],        // so2
    [4000, 8000, 15000, 30000], // co
    [120, 235, 400, 800],       // o3
    [80, 200, 1130, 2260],      // no2
    [45, 100, 215, 432]         // hc
  ];

  for (var j = 0; j < nilai.length; j++) {
    var p = poinUdara(nilai[j], batas[j]);
    ispu = ispu + p;
    rincian += "<tr><td>" + nama[j] + "</td><td>" + nilai[j] + " &micro;g/m&sup3;</td><td>" + p + "</td></tr>";
  }

  var kategori, warna, teks;
  if (ispu <= 50) {
    kategori = "Baik"; warna = "#4cc36b"; teks = "#06301a";
  } else if (ispu <= 100) {
    kategori = "Sedang"; warna = "#4a90e2"; teks = "#fff";
  } else if (ispu <= 200) {
    kategori = "Tidak Sehat"; warna = "#f3c04f"; teks = "#4a3600";
  } else if (ispu <= 300) {
    kategori = "Sangat Tidak Sehat"; warna = "#ef4b4b"; teks = "#fff";
  } else {
    kategori = "Berbahaya"; warna = "#111"; teks = "#fff";
  }

  hasilDiv.innerHTML =
    '<div class="hasil">' +
    '<div class="big">' + ispu + "</div>" +
    '<div class="badge" style="background:' + warna + ";color:" + teks + ';border:2px solid #fff">Indeks ISPU = ' + kategori + "</div>" +
    '<div class="panel"><table>' +
    "<tr><th>Parameter</th><th>Konsentrasi</th><th>Poin</th></tr>" +
    rincian +
    "<tr><td><b>Total</b></td><td></td><td><b>" + ispu + "</b></td></tr>" +
    "</table></div></div>";
}

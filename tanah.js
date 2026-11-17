// ---------- pencemaran tanah (indeks Nemerow / Pn) ----------

// untuk logam berat: <= a -> 0, <= b -> 0.2, selebihnya 0.7
function poinLogam(nilai, a, b) {
  if (nilai <= a) return 0;
  if (nilai <= b) return 0.2;
  return 0.7;
}

function hitungTanah() {
  var err = ambil("tanah-err");
  var hasilDiv = ambil("tanah-hasil");
  err.textContent = "";
  hasilDiv.innerHTML = "";

  var jenis_tambang = parseInt(ambil("tambang").value);

  var pht = angka("pht");
  var ec = angka("ec");
  var corg = angka("corg");
  var ktk = angka("ktk");
  var klb = angka("klb");

  var wajib = [pht, ec, corg, ktk, klb];
  var logam;
  if (jenis_tambang == 2) {
    logam = [angka("klbf"), angka("klbm"), angka("klbso4")];
  } else {
    logam = [angka("klbni"), angka("klbco"), angka("klbcr6")];
  }

  if (adaKosong(wajib) || adaKosong(logam)) {
    err.textContent = "Semua kolom harus diisi dengan angka";
    return;
  }
  if (pht < 0 || pht > 14) {
    err.textContent = "Nilai pH harus dalam rentang 0 - 14";
    return;
  }
  var semua = wajib.concat(logam);
  for (var i = 1; i < semua.length; i++) {
    if (semua[i] < 0) {
      err.textContent = "Nilai harus lebih dari atau sama dengan nol";
      return;
    }
  }

  var pn = 0;

  // pH tanah
  if (pht <= 4.5) {
    pn = pn + 0.7;
  } else if (pht <= 5.5) {
    pn = pn + 0.2;
  } else if (pht <= 8.5) {
    pn = pn + 0;
  } else if (pht <= 9.5) {
    pn = pn + 0.2;
  } else {
    pn = pn + 0.7;
  }

  // daya hantar listrik
  if (ec <= 2) {
    pn = pn + 0;
  } else if (ec <= 4) {
    pn = pn + 0.2;
  } else {
    pn = pn + 0.7;
  }

  // c-organik
  if (corg <= 2) {
    pn = pn + 0.7;
  } else if (corg <= 5) {
    pn = pn + 0.2;
  } else {
    pn = pn + 0;
  }

  // kapasitas tukar kation
  if (ktk <= 5) {
    pn = pn + 0.7;
  } else if (ktk <= 20) {
    pn = pn + 0.2;
  } else {
    pn = pn + 0;
  }

  // Pb
  pn = pn + poinLogam(klb, 1.5, 6);

  if (jenis_tambang == 2) {
    // batu bara : Fe, Mn, SO4
    pn = pn + poinLogam(logam[0], 100, 250);
    pn = pn + poinLogam(logam[1], 5, 18);
    pn = pn + poinLogam(logam[2], 1.5, 3);
  } else {
    // nikel : Ni, Co, Cr6+
    pn = pn + poinLogam(logam[0], 0.5, 2.1);
    pn = pn + poinLogam(logam[1], 0.3, 2.4);
    pn = pn + poinLogam(logam[2], 0.075, 0.25);
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

  hasilDiv.innerHTML =
    '<div class="hasil">' +
    '<div class="big">' + pn.toFixed(2) + "</div>" +
    '<div class="badge b-' + kelas + '">Indeks tanah = ' + kategori + "</div>" +
    "</div>";
}

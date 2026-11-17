// data zat terlarut untuk tiap jenis tambang (1 = Nikel, 2 = Batu Bara)
// catatan: batas Ni, Co, dan Cr6+ masih placeholder, ganti kalau sudah ada dari soal
// cuma batas Pb (0.1) yang sama dengan soal
var nama_zat = {
  1: ["Ni (Nikel)", "Co (Kobalt)", "Cr6+ (Kromium heksavalen)", "Pb (Timbal)"],
  2: ["Fe (Besi)", "Mn (Mangan)", "SO4 (Sulfat)", "Pb (Timbal)"]
};

var batas_zat = {
  1: [0.1, 0.5, 0.2, 0.1],
  2: [0.3, 0.4, 250, 0.1]
};

// ambil elemen berdasarkan id
function ambil(id) {
  return document.getElementById(id);
}

// ambil isi input jadi angka, kalau kosong hasilnya NaN
function angka(id) {
  var teks = ambil(id).value;
  if (teks.trim() === "") {
    return NaN;
  }
  return parseFloat(teks);
}

// cek apakah ada angka yang kosong
function adaKosong(daftar) {
  for (var i = 0; i < daftar.length; i++) {
    if (isNaN(daftar[i])) {
      return true;
    }
  }
  return false;
}

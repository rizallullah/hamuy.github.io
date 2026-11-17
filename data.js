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

// saran penanganan tiap zat
var saran_zat = {
  "Fe": "Lakukan aerasi lalu filtrasi pasir untuk mengendapkan besi.",
  "Mn": "Oksidasi (aerasi atau klorin) lalu filtrasi, naikkan pH kalau perlu.",
  "SO4": "Netralisasi dengan kapur, pakai wetland atau reverse osmosis.",
  "Pb": "Pakai adsorpsi (karbon aktif atau zeolit), penukar ion, atau presipitasi hidroksida.",
  "Ni": "Presipitasi hidroksida pada pH 9 - 10 lalu pengendapan dan filtrasi.",
  "Co": "Presipitasi hidroksida atau sulfida, atau pakai penukar ion.",
  "Cr6+": "Reduksi Cr6+ jadi Cr3+ (misal ferro sulfat) lalu presipitasi hidroksida."
};

// warna gunung di latar tiap halaman
var warna_tema = {
  menu: "#2d7a8c",
  air: "#3b8f6a",
  udara: "#5a7fb0",
  tanah: "#c46a4a",
  audit: "#9a6bb5",
  hasil: "#2d7a8c"
};

var ya_tidak = [["ya", "Ya"], ["tidak", "Tidak"]];

// ambil elemen berdasarkan id
function ambil(id) {
  return document.getElementById(id);
}

// syarat angka yang dipakai di banyak soal
function nolKeAtas(n) {
  return n >= 0;
}

function diAtasNol(n) {
  return n > 0;
}

function phWajar(n) {
  return n >= 0 && n <= 14;
}

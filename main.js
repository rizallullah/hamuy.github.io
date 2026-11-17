// ---------- data halaman ----------
var layar = "menu"; // menu, soal, atau hasil
var mode = "";      // air, udara, tanah, audit
var langkah = [];   // daftar soal yang sedang dipakai
var no = 0;         // nomor soal sekarang
var tab = 0;        // tab di halaman hasil
var jawab = {};     // semua jawaban
var hasil = null;

var nama_tab = ["Ringkasan", "Fakta &amp; Angka", "Saran"];

var daftar_menu = [
  { mode: "air", ikon: "💧", nama: "Kualitas Air", ket: "Pengamatan awal dan IKA (indeks kelayakan air)" },
  { mode: "udara", ikon: "🌫️", nama: "Kualitas Udara", ket: "Klasifikasi ISPU dari 7 parameter" },
  { mode: "tanah", ikon: "🌱", nama: "Pencemaran Tanah", ket: "Indeks Nemerow (Pn)" },
  { mode: "audit", ikon: "⚖️", nama: "Audit Perusahaan", ket: "Akumulasi denda dan pidana penjara" }
];

function setTema(nama) {
  ambil("gunung").setAttribute("fill", warna_tema[nama]);
}

// ---------- mulai, kembali, lanjut ----------
function mulai(m) {
  mode = m;
  if (m == "air") langkah = soal_air;
  if (m == "udara") langkah = soal_udara;
  if (m == "tanah") langkah = soal_tanah;
  if (m == "audit") langkah = soal_audit;

  jawab = {};
  for (var i = 0; i < langkah.length; i++) {
    if (langkah[i].awal !== undefined) {
      jawab[langkah[i].k] = langkah[i].awal;
    }
  }
  no = 0;
  tab = 0;
  layar = "soal";
  tampilkan();
}

function keMenu() {
  layar = "menu";
  tampilkan();
}

function kembali() {
  if (no == 0) {
    keMenu();
  } else {
    no = no - 1;
    tampilkan();
  }
}

// cek jawaban soal sekarang, hasilnya pesan error (kosong kalau aman)
function cekLangkah(s) {
  if (s.jenis == "pilih") {
    if (jawab[s.k] === undefined || jawab[s.k] === "") {
      return "Pilih salah satu jawaban dulu";
    }
    return "";
  }

  if (s.jenis == "banyak") {
    var daftar = s.daftar();
    for (var i = 0; i < daftar.length; i++) {
      var isi = parseFloat(jawab[daftar[i].k]);
      if (isNaN(isi)) {
        return "Semua kolom harus diisi dengan angka";
      }
      if (isi < 0) {
        return s.negatif;
      }
    }
    return "";
  }

  var n = parseFloat(jawab[s.k]);
  if (isNaN(n)) {
    return "Isi dulu dengan angka";
  }
  if (!s.ok(n)) {
    return s.pesan;
  }
  return "";
}

function lanjut() {
  var s = langkah[no];
  var pesan = cekLangkah(s);
  ambil("err").textContent = pesan;
  if (pesan != "") {
    return;
  }

  // tidak mau observasi lanjutan, langsung ke hasil
  if (s.k == "lanjut" && jawab.lanjut == "tidak") {
    selesai();
    return;
  }
  if (no == langkah.length - 1) {
    selesai();
    return;
  }
  no = no + 1;
  tampilkan();
}

function selesai() {
  if (mode == "air") hasil = hasilAir();
  if (mode == "udara") hasil = hasilUdara();
  if (mode == "tanah") hasil = hasilTanah();
  if (mode == "audit") hasil = hasilAudit();
  layar = "hasil";
  tab = 0;
  tampilkan();
}

function gantiTab(n) {
  tab = n;
  tampilkan();
  window.scrollTo(0, 0);
}

// ---------- input ----------
function pilih(k, v) {
  jawab[k] = v;
  tampilkan();
}

// slider dan kotak angka dengan data-k yang sama saling mengikuti
function isi(el) {
  var k = el.getAttribute("data-k");
  jawab[k] = el.value;
  var sama = document.querySelectorAll('[data-k="' + k + '"]');
  for (var i = 0; i < sama.length; i++) {
    if (sama[i] !== el) {
      sama[i].value = el.value;
    }
  }
}

function nilaiJawab(k) {
  return jawab[k] === undefined ? "" : jawab[k];
}

// ---------- tampilan ----------
function tampilkan() {
  ambil("bar").style.display = layar == "soal" ? "block" : "none";
  ambil("tabs").style.display = layar == "hasil" ? "flex" : "none";

  if (layar == "menu") tampilMenu();
  if (layar == "soal") tampilSoal();
  if (layar == "hasil") tampilHasil();
}

function tampilMenu() {
  setTema("menu");
  var kartu = "";
  for (var i = 0; i < daftar_menu.length; i++) {
    var d = daftar_menu[i];
    kartu +=
      '<div class="hc"><div class="ikon">' + d.ikon + "</div>" +
      "<h3>" + d.nama + "</h3><p>" + d.ket + "</p>" +
      '<button class="btn" onclick="mulai(\'' + d.mode + '\')">Mulai uji</button></div>';
  }

  ambil("app").innerHTML =
    '<div class="muncul">' +
    '<h1 class="judul">JERAT</h1>' +
    '<p class="sub besar">Jaringan Evaluasi Regulasi dan Aturan Tambang</p>' +
    '<p class="sub">Pilih bagian yang ingin diuji, nanti ditanya satu per satu.</p>' +
    '<div class="hub">' + kartu + "</div></div>";
}

function tampilSoal() {
  var s = langkah[no];
  setTema(mode);
  ambil("isi_bar").style.width = ((no + 1) / langkah.length * 100) + "%";

  var h = '<div class="muncul"><div class="bagian">' + s.bagian + "</div>";
  h += '<h2 class="tanya">' + s.tanya + "</h2>";
  if (s.sub) {
    h += '<p class="sub">' + s.sub() + "</p>";
  }

  if (s.jenis == "pilih") {
    h += '<div class="opsi">';
    for (var i = 0; i < s.pilihan.length; i++) {
      var v = s.pilihan[i][0];
      var kelas = jawab[s.k] == v ? "opt on" : "opt";
      h += '<div class="' + kelas + '" onclick="pilih(\'' + s.k + "','" + v + '\')"><i></i>' + s.pilihan[i][1] + "</div>";
    }
    h += "</div>";
  }

  if (s.jenis == "slider") {
    h +=
      '<div class="row"><span>' + s.kiri + "</span>" +
      '<input type="range" data-k="' + s.k + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + nilaiJawab(s.k) + '" oninput="isi(this)">' +
      "<span>" + s.kanan + "</span></div>" +
      '<div><input class="num" type="number" step="any" data-k="' + s.k + '" value="' + nilaiJawab(s.k) + '" oninput="isi(this)"> ' +
      '<span class="satuan">' + s.satuan + "</span></div>";
  }

  if (s.jenis == "angka") {
    h +=
      '<div style="margin:24px 0"><input class="num" type="number" step="any" data-k="' + s.k + '" value="' + nilaiJawab(s.k) + '" placeholder="0" oninput="isi(this)"> ' +
      '<span class="satuan">' + s.satuan + "</span></div>";
  }

  if (s.jenis == "banyak") {
    var daftar = s.daftar();
    h += '<div class="grid4">';
    for (var j = 0; j < daftar.length; j++) {
      h +=
        "<div><label>" + daftar[j].label + "</label>" +
        '<input class="num" type="number" step="any" value="' + nilaiJawab(daftar[j].k) + '" oninput="jawab[\'' + daftar[j].k + '\']=this.value"></div>';
    }
    h += "</div>";
  }

  var teks_lanjut = no == langkah.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya";
  h +=
    '<div class="err" id="err"></div>' +
    '<div class="btns"><button class="btn ghost" onclick="kembali()">Kembali</button>' +
    '<button class="btn" onclick="lanjut()">' + teks_lanjut + "</button></div></div>";

  ambil("app").innerHTML = h;
}

function tampilHasil() {
  setTema("hasil");

  var tombol_tab = "";
  for (var i = 0; i < nama_tab.length; i++) {
    var kelas = i == tab ? "on" : "";
    tombol_tab += '<button class="' + kelas + '" onclick="gantiTab(' + i + ')">' + nama_tab[i] + "</button>";
  }
  ambil("tabs").innerHTML = tombol_tab;

  var h = '<div class="muncul" style="margin-top:40px">';
  if (tab == 0) {
    h += hasil.ringkas;
    h += '<div class="btns"><button class="btn" onclick="gantiTab(1)">Lihat detail</button></div>';
  }
  if (tab == 1) {
    h += '<div class="bagian">Fakta &amp; Angka</div>';
    h += '<div class="panel"><table>' + hasil.detail + "</table></div>";
  }
  if (tab == 2) {
    h += '<div class="bagian">Saran &amp; Solusi</div><div class="panel"><ul class="tips">';
    for (var j = 0; j < hasil.saran.length; j++) {
      h += "<li><b>" + hasil.saran[j][0] + "</b>" + hasil.saran[j][1] + "</li>";
    }
    h += "</ul></div>";
  }

  h += '<div class="btns"><button class="btn ghost" onclick="mulai(mode)">Uji ulang</button>';
  h += '<button class="btn ghost" onclick="keMenu()">Menu</button>';
  if (tab < 2) {
    h += '<button class="btn" onclick="gantiTab(' + (tab + 1) + ')">Berikutnya</button>';
  }
  h += "</div></div>";

  ambil("app").innerHTML = h;
}

tampilkan();

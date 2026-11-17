// ---------- pindah halaman ----------
function tampilkan(id) {
  var halaman = document.querySelectorAll(".hal");
  for (var i = 0; i < halaman.length; i++) {
    halaman[i].classList.remove("tampil");
  }
  ambil(id).classList.add("tampil");

  var tombol = document.querySelectorAll("nav.tabs button");
  for (var j = 0; j < tombol.length; j++) {
    if (tombol[j].getAttribute("data-hal") == id) {
      tombol[j].classList.add("on");
    } else {
      tombol[j].classList.remove("on");
    }
  }
  window.scrollTo(0, 0);
}

// semua tombol yang punya data-hal
var semuaTombol = document.querySelectorAll("[data-hal]");
for (var k = 0; k < semuaTombol.length; k++) {
  semuaTombol[k].addEventListener("click", function () {
    tampilkan(this.getAttribute("data-hal"));
  });
}

// ---------- ganti jenis tambang ----------
function gantiTambang() {
  var jenis = parseInt(ambil("tambang").value);
  var nama = jenis == 1 ? "Nikel" : "Batu Bara";

  var label = document.querySelectorAll(".nama-tambang");
  for (var i = 0; i < label.length; i++) {
    label[i].textContent = nama;
  }

  // nama zat di form air
  for (var j = 0; j < 4; j++) {
    ambil("zat" + j).textContent = "Massa " + nama_zat[jenis][j] + " (mg)";
  }

  // form tanah beda tiap tambang
  ambil("tanah-nikel").style.display = jenis == 1 ? "block" : "none";
  ambil("tanah-batubara").style.display = jenis == 2 ? "block" : "none";

  // hasil lama dihapus supaya tidak membingungkan
  ambil("air-hasil").innerHTML = "";
  ambil("tanah-hasil").innerHTML = "";
}

ambil("tambang").addEventListener("change", gantiTambang);

// ---------- observasi lanjutan air ----------
ambil("lanjut").addEventListener("change", function () {
  ambil("air-lanjut").style.display = this.value == "ya" ? "block" : "none";
});

// ---------- tombol hitung ----------
ambil("air-hitung").addEventListener("click", hitungAir);
ambil("udara-hitung").addEventListener("click", hitungUdara);
ambil("tanah-hitung").addEventListener("click", hitungTanah);
ambil("audit-hitung").addEventListener("click", hitungAudit);

gantiTambang();

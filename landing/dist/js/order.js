window.addEventListener("pageshow", function (event) {
  if (event.persisted || performance.navigation.type === 2) {
    document.getElementById("orderForm").reset();
    document.getElementById("errNama").innerHTML = "";
    document.getElementById("errSpek").innerHTML = "";
    document.getElementById("errArea").innerHTML = "";
    document.getElementById("errDate").innerHTML = "";
  }
});

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("errNama").innerHTML = "";
  document.getElementById("errSpek").innerHTML = "";
  document.getElementById("errArea").innerHTML = "";
  document.getElementById("errDate").innerHTML = "";

  const nama = document.getElementById("namaLengkap").value.trim();
  const spek = document.getElementById("spekRumah").value.trim();
  const luas = document.getElementById("luasArea").value.trim();
  const tanggal = document.getElementById("tanggal").value;

  let isValid = true;

  if (nama === "") {
    document.getElementById("errNama").innerHTML =
      '<span class="text-red-500 text-sm">Nama lengkap harus diisi</span>';
    isValid = false;
  }
  if (spek === "") {
    document.getElementById("errSpek").innerHTML =
      '<span class="text-red-500 text-sm">Spesifikasi rumah harus diisi</span>';
    isValid = false;
  }
  if (luas === "" || luas <= 0) {
    document.getElementById("errArea").innerHTML =
      '<span class="text-red-500 text-sm">Luas area harus diisi dengan angka yang valid</span>';
    isValid = false;
  }
  if (tanggal === "") {
    document.getElementById("errDate").innerHTML =
      '<span class="text-red-500 text-sm">Tanggal survey harus diisi</span>';
    isValid = false;
  } else {
    const selectedDate = new Date(tanggal);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      document.getElementById("errDate").innerHTML =
        '<span class="text-red-500 text-sm">Tanggal survey tidak boleh di masa lalu</span>';
      isValid = false;
    }
  }

  if (isValid) {
    const orderData = {
      id: "AC-" + Date.now(),
      nama: nama,
      spek: spek,
      luas: Number(luas),
      tanggal: tanggal,
      harga: hitungHarga(luas),
      status: "Pending",
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));

    this.reset();

    showPopup();
  }
});

const popup = document.getElementById("successPopup");
const popupBox = document.getElementById("popupBox");

function showPopup() {
  popup.classList.remove("hidden");

  setTimeout(() => {
    popupBox.classList.remove("scale-90", "translate-y-4", "opacity-0");
  }, 10);
}

function hidePopup() {
  popupBox.classList.add("scale-90", "translate-y-4", "opacity-0");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 200);

  window.location.href = "index.html";
}

document.getElementById("popupOkBtn").addEventListener("click", hidePopup);

function hitungHarga(luas) {
  return luas * 100000;
}

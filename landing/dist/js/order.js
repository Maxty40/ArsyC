document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('namaLengkap').value.trim();
    const spek = document.getElementById('spekRumah').value.trim();
    const area = document.getElementById('luasArea').value.trim();
    const tanggal = document.getElementById('tanggal').value;

    if (!nama || !spek || !area || !tanggal) {
        alert('Mohon lengkapi semua data');
        return;
    }

    const orderData = {
        id: 'AC-' + Date.now(),
        nama: nama,
        spek: spek,
        area: Number(area),
        tanggal: tanggal,
        harga: hitungHarga(area),
        status: 'Pending'
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    alert('Pesanan Anda Telah Kami Terima!');
    this.reset();
});

function hitungHarga(area) {
    return area * 100000;
}
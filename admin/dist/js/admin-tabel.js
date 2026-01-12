// fungsi ambil data dari localstorage hasil input form
function loadTransactions() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    return orders.map(o => ({
        orderId: `#${o.id}`,
        clientName: o.nama,
        designType: o.spek,
        landArea: o.luas || o.landArea,
        date: formatTanggal(o.tanggal),
        price: o.harga,
        status: o.status
    }));
}

function formatTanggal(tgl) {
    const d = new Date(tgl);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}
let transactions = loadTransactions();
let filteredData = [...transactions];

function saveToLocalStorage() {
    const orders = transactions.map(t => ({
        id: t.orderId.replace('#', ''),
        nama: t.clientName,
        spek: t.designType,
        luas: t.landArea,
        tanggal: reverseTanggal(t.date),
        harga: t.price,
        status: t.status
    }))

    localStorage.setItem('orders', JSON.stringify(orders));
}

function reverseTanggal(tgl) {
    const [d, m, y] = tgl.split('.');
    return `${y}-${m}-${d}`;
}
//
document.addEventListener('DOMContentLoaded', function () {
    renderTable();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        filteredData = transactions.filter(item =>
            item.clientName.toLowerCase().includes(searchTerm) ||
            item.orderId.toLowerCase().includes(searchTerm) ||
            item.designType.toLowerCase().includes(searchTerm)
        );
        renderTable();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            if (filter === 'all') {
                filteredData = [...transactions];
            } else {
                filteredData = transactions.filter(item =>
                    item.status.toLowerCase() === filter.toLowerCase()
                );
            }
            renderTable();
        });
    });

    document.getElementById('editModal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });

    document.getElementById('detailModal').addEventListener('click', function (e) {
        if (e.target === this) closeDetailModal();
    });

    document.getElementById('confirmModal').addEventListener('click', function (e) {
        if (e.target === this) closeConfirmModal();
    });

    document.getElementById('editForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveEdit();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
            closeDetailModal();
            closeConfirmModal();
        }
    });
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    filteredData.forEach((item, index) => {
        const statusClass = getStatusClass(item.status);
        const row = `
            <tr>
              <td class="order-id">${item.orderId}</td>
              <td class="client-name">${item.clientName}</td>
              <td>${item.designType}</td>
              <td>${item.landArea} m²</td>
              <td>${item.date}</td>
              <td>Rp ${item.price.toLocaleString('id-ID')}</td>
              <td><span class="status-indicator ${statusClass}">${item.status}</span></td>
              <td>
                <div class="action-group">
                  <button class="action-button view" onclick="viewDetail(${index})">
                    <i class="bi bi-eye"></i> Detail
                  </button>
                  <button class="action-button edit" onclick="editTransaction(${index})">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button class="action-button delete" onclick="deleteTransaction(${index})">
                    <i class="bi bi-trash"></i> Hapus
                  </button>
                </div>
              </td>
            </tr>
          `;
        tbody.innerHTML += row;
    });

    updateCounts();
}

function getStatusClass(status) {
    const classes = {
        'Pending': 'status-awaiting',
        'Proses': 'status-processing',
        'Selesai': 'status-finalized',
        'Dibatalkan': 'status-terminated'
    };
    return classes[status] || '';
}

function updateCounts() {
    document.getElementById('showingCount').textContent = filteredData.length;
    document.getElementById('totalCount').textContent = transactions.length;
}

function viewDetail(index) {
    const item = filteredData[index];
    const statusClass = getStatusClass(item.status);

    const detail = `
          <div class="detail-item" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); margin-bottom: 25px;">
            <div class="detail-icon" style="background: var(--primary-color); color: white;">
              <i class="bi bi-receipt"></i>
            </div>
            <div class="detail-content">
              <div class="detail-label">Nomor Order</div>
              <div class="detail-value" style="font-size: 20px; color: var(--primary-color);">${item.orderId}</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon" style="background: rgba(102, 126, 234, 0.1); color: var(--primary-color);">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="detail-content">
              <div class="detail-label">Nama Klien</div>
              <div class="detail-value">${item.clientName}</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success-color);">
              <i class="bi bi-rulers"></i>
            </div>
            <div class="detail-content">
              <div class="detail-label">Spesifikasi Desain</div>
              <div class="detail-value">${item.designType}</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning-color);">
              <i class="bi bi-bounding-box"></i>
            </div>
            <div class="detail-content">
              <div class="detail-label">Luas Area</div>
              <div class="detail-value">${item.landArea} m²</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon" style="background: rgba(59, 130, 246, 0.1); color: var(--info-color);">
              <i class="bi bi-calendar-event"></i>
            </div>
            <div class="detail-content">
              <div class="detail-label">Tanggal Transaksi</div>
              <div class="detail-value">${item.date}</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success-color);">
              <i class="bi bi-cash-stack"></i>
            </div>
            <div class="detail-content">
              <div class="detail-label">Nilai Kontrak</div>
              <div class="detail-value" style="font-size: 20px; color: var(--success-color);">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon" style="background: rgba(102, 126, 234, 0.1); color: var(--primary-color);">
              <i class="bi bi-clipboard-check"></i>
            </div>
            <div class="detail-content">
              <div class="detail-label">Status Transaksi</div>
              <div style="margin-top: 8px;">
                <span class="status-indicator ${statusClass}">${item.status}</span>
              </div>
            </div>
          </div>
        `;

    document.getElementById('detailContent').innerHTML = detail;
    document.getElementById('detailModal').classList.add('active');

    showToast('info', 'Detail Ditampilkan', `Menampilkan detail transaksi ${item.orderId}`);
}

function editTransaction(index) {
    const item = filteredData[index];
    const realIndex = transactions.findIndex(t => t.orderId === item.orderId);

    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil-square"></i> Edit Transaksi';
    document.getElementById('editIndex').value = realIndex;
    document.getElementById('editOrderId').value = item.orderId;
    document.getElementById('editClientName').value = item.clientName;
    document.getElementById('editDesignType').value = item.designType;
    document.getElementById('editLandArea').value = item.landArea;

    const dateParts = item.date.split('.');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    document.getElementById('editDate').value = formattedDate;

    document.getElementById('editPrice').value = item.price;
    document.getElementById('editStatus').value = item.status;

    document.getElementById('editModal').classList.add('active');

    showToast('info', 'Mode Edit', `Mengedit transaksi ${item.orderId}`);
}

function deleteTransaction(index) {
    const item = filteredData[index];

    const detailsHTML = `
          <p><strong>Nomor Order:</strong> ${item.orderId}</p>
          <p><strong>Nama Klien:</strong> ${item.clientName}</p>
          <p><strong>Spesifikasi:</strong> ${item.designType}</p>
          <p><strong>Nilai Kontrak:</strong> Rp ${item.price.toLocaleString('id-ID')}</p>
        `;

    document.getElementById('confirmDetails').innerHTML = detailsHTML;

    document.getElementById('confirmDeleteBtn').onclick = function () {
        const realIndex = transactions.findIndex(t => t.orderId === item.orderId);
        transactions.splice(realIndex, 1);
        saveToLocalStorage();
        filteredData = [...transactions];
        renderTable();
        closeConfirmModal();

        showToast('success', 'Berhasil Dihapus!', `Transaksi ${item.orderId} telah dihapus dari sistem`);
    };

    document.getElementById('confirmModal').classList.add('active');
}

function saveEdit() {
    const index = document.getElementById('editIndex').value;
    const dateInput = document.getElementById('editDate').value;
    const dateParts = dateInput.split('-');
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

    const isNewTransaction = index === '-1';
    const orderId = document.getElementById('editOrderId').value;
    const clientName = document.getElementById('editClientName').value;

    const transactionData = {
        orderId: orderId,
        clientName: clientName,
        designType: document.getElementById('editDesignType').value,
        landArea: parseInt(document.getElementById('editLandArea').value),
        date: formattedDate,
        price: parseInt(document.getElementById('editPrice').value),
        status: document.getElementById('editStatus').value
    };

    if (isNewTransaction) {
        transactions.push(transactionData);
        saveToLocalStorage();
        closeModal();
        filteredData = [...transactions];
        renderTable();
        showToast('success', 'Transaksi Berhasil Ditambahkan!', `Transaksi baru ${orderId} untuk ${clientName} telah ditambahkan ke sistem`);
    } else {
        transactions[index] = transactionData;
        saveToLocalStorage();
        closeModal();
        filteredData = [...transactions];
        renderTable();
        showToast('success', 'Perubahan Berhasil Disimpan!', `Data transaksi ${orderId} telah diperbarui`);
    }
}

function openAddModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle"></i> Tambah Transaksi Baru';
    document.getElementById('editIndex').value = '-1';
    document.getElementById('editForm').reset();

    let newId = '#AC-001';

    if (transactions.length > 0) {
        const lastId = transactions[transactions.length - 1].orderId;
        const lastNum = parseInt(lastId.split('-')[1]);
        newId = `#AC-${String(lastNum + 1).padStart(3, '0')}`;
    }
    document.getElementById('editOrderId').value = newId;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('editDate').value = formattedDate;

    document.getElementById('editModal').classList.add('active');

    showToast('info', 'Mode Tambah', 'Silakan isi form untuk menambah transaksi baru');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function exportData() {
    let csv = 'Nomor Order,Nama Klien,Spesifikasi Desain,Luas Area,Tanggal,Nilai Kontrak,Status\n';
    transactions.forEach(item => {
        csv += `${item.orderId},${item.clientName},"${item.designType}",${item.landArea},${item.date},${item.price},${item.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaksi_arsyc_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast('success', 'Export Berhasil!', `${transactions.length} transaksi telah diexport ke file CSV`);
}

function showToast(type, title, message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const icons = {
        'success': 'bi-check-circle-fill',
        'error': 'bi-x-circle-fill',
        'info': 'bi-info-circle-fill',
        'warning': 'bi-exclamation-triangle-fill'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
          <div class="toast-icon">
            <i class="bi ${icons[type]}"></i>
          </div>
          <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
          </div>
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
// OverlayScrollbars Configuration
const SELECTOR_SIDEBAR_WRAPPER = '.sidebar-wrapper';
const Default = {
    scrollbarTheme: 'os-theme-light',
    scrollbarAutoHide: 'leave',
    scrollbarClickScroll: true,
};

document.addEventListener('DOMContentLoaded', function () {
    const sidebarWrapper = document.querySelector(SELECTOR_SIDEBAR_WRAPPER);
    if (sidebarWrapper && OverlayScrollbarsGlobal?.OverlayScrollbars !== undefined) {
        OverlayScrollbarsGlobal.OverlayScrollbars(sidebarWrapper, {
            scrollbars: {
                theme: Default.scrollbarTheme,
                autoHide: Default.scrollbarAutoHide,
                clickScroll: Default.scrollbarClickScroll,
            },
        });
    }

    // Filter table rows
    const filterOptions = document.querySelectorAll('.filter-option');

    filterOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            filterOptions.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.textContent.toLowerCase();

            const rows = document.querySelectorAll('#orderTable tr');
            rows.forEach(row => {
                const statusEl = row.querySelector('.status-indicator');
                if (!statusEl) return;

                const status = statusEl.textContent.toLowerCase();
                row.style.display = filter === 'semua' || status.includes(filter) ? '' : 'none';
            });
        });
    });
});

// Update from localstorage

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('orderTable');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    table.innerHTML = '';

    orders.forEach((o, i) => {
        table.innerHTML += `
        <tr>
          <td class="order-id">#${o.id}</td>
          <td class="client-name">${o.nama}</td>
          <td class="design-type">${o.spek}</td>
          <td class="land-area">${o.area}</td>
          <td>${formatTanggal(o.tanggal)}</td>
          <td class="price">${formatRupiah(o.harga)}</td>
          <td>
            <span class="status-indicator status-awaiting">
              ${o.status}
              </span>
          </td>
        </tr>
        `;
    });
});

function formatRupiah(angka) {
    return angka.toLocaleString('id-ID');
}

function formatTanggal(tgl) {
    const d = new Date(tgl);
    return d.toLocaleDateString('id-ID');
}
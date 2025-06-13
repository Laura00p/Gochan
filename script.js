

// Check authentication
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Logout functionality
document.getElementById('userProfile').addEventListener('click', function() {
    const confirmLogout = confirm('Apakah Anda yakin ingin keluar?');
    if (confirmLogout) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
});

// Service selection
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        openServiceModal(service);
    });
});

// Modal functionality
const modal = document.getElementById('serviceModal');
const closeModal = document.querySelector('.close-modal');
const confirmOrder = document.getElementById('confirmOrder');

closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Open service modal
function openServiceModal(service) {
    const modalTitle = document.getElementById('modalTitle');
    let title = '';
    
    switch(service) {
        case 'goride':
            title = 'Pesan GoRide';
            break;
        case 'gocar':
            title = 'Pesan GoCar';
            break;
        case 'gofood':
            title = 'Pesan GoFood';
            break;
        case 'goshop':
            title = 'Pesan GoShop';
            break;
        case 'gosend':
            title = 'Pesan GoSend';
            break;
        case 'gomart':
            title = 'Pesan GoMart';
            break;
        case 'gomed':
            title = 'Pesan GoMed';
            break;
        default:
            title = 'Pesan Layanan';
    }
    
    modalTitle.textContent = title;
    modal.style.display = 'flex';
    
    // Initialize map (Leaflet.js)
    const map = L.map('map').setView([-6.2088, 106.8456], 13); // Default to Jakarta
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    const marker = L.marker([-6.2088, 106.8456]).addTo(map)
        .bindPopup('Lokasi Anda saat ini')
        .openPopup();
}

// Confirm order
confirmOrder.addEventListener('click', function() {
    const pickupLocation = document.getElementById('pickupLocation').value;
    const destination = document.getElementById('destination').value;
    
    if (!pickupLocation || !destination) {
        alert('Harap isi lokasi penjemputan dan tujuan');
        return;
    }
    
    // Simpan data pesanan (simulasi)
    const order = {
        service: document.getElementById('modalTitle').textContent.replace('Pesan ', ''),
        pickup: pickupLocation,
        destination: destination,
        date: new Date().toLocaleString(),
        status: 'Mencari driver'
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(order));
    alert('Pesanan Anda sedang diproses, mohon tunggu driver');
    modal.style.display = 'none';
    window.location.href = 'order.html';
});

// Search functionality
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
            alert(`Anda mencari: ${query}`);
            // Di implementasi nyata, ini akan menampilkan hasil pencarian
        }
    }
});
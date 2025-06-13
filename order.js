// order.js - JavaScript untuk halaman pesanan

// Check authentication
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// DOM Elements
const orderService = document.getElementById('orderService');
const orderStatus = document.getElementById('orderStatus');
const pickupLocation = document.getElementById('pickupLocation');
const pickupAddress = document.getElementById('pickupAddress');
const destination = document.getElementById('destination');
const destinationAddress = document.getElementById('destinationAddress');
const driverInfo = document.getElementById('driverInfo');
const driverName = document.getElementById('driverName');
const vehicleInfo = document.getElementById('vehicleInfo');

// Data driver untuk simulasi
const drivers = [
    {
        name: "Budi Santoso",
        rating: 4.8,
        reviews: 250,
        vehicle: "Honda Beat",
        plate: "AB 1234 CD",
        phone: "+628123456789",
        photo: "https://via.placeholder.com/80x80?text=Driver1"
    },
    {
        name: "Andi Wijaya",
        rating: 4.9,
        reviews: 320,
        vehicle: "Yamaha NMAX",
        plate: "AB 5678 EF",
        phone: "+628987654321",
        photo: "https://via.placeholder.com/80x80?text=Driver2"
    },
    {
        name: "Siti Rahayu",
        rating: 4.7,
        reviews: 180,
        vehicle: "Toyota Avanza",
        plate: "B 1234 AC",
        phone: "+628567891234",
        photo: "https://via.placeholder.com/80x80?text=Driver3"
    }
];

// Status order simulation
const statusFlow = [
    "Mencari driver",
    "Driver ditemukan",
    "Driver menuju lokasi",
    "Anda dijemput",
    "Dalam perjalanan",
    "Sampai di tujuan",
    "Pesanan selesai"
];

// Load order data
function loadOrderData() {
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    
    if (!order) {
        alert('Tidak ada data pesanan, Anda akan diarahkan ke halaman utama');
        window.location.href = 'index.html';
        return;
    }
    
    // Update order info
    orderService.textContent = order.service;
    orderStatus.textContent = order.status;
    pickupLocation.textContent = "Lokasi Penjemputan";
    pickupAddress.textContent = order.pickup;
    destination.textContent = "Tujuan";
    destinationAddress.textContent = order.destination;
    
    // Start order simulation
    simulateOrderProgress(order);
}

// Simulate order progress
function simulateOrderProgress(order) {
    let currentStatusIndex = statusFlow.indexOf(order.status);
    if (currentStatusIndex === -1) currentStatusIndex = 0;
    
    const interval = setInterval(() => {
        // Update status
        currentStatusIndex++;
        if (currentStatusIndex >= statusFlow.length) {
            clearInterval(interval);
            completeOrder();
            return;
        }
        
        order.status = statusFlow[currentStatusIndex];
        orderStatus.textContent = order.status;
        localStorage.setItem('currentOrder', JSON.stringify(order));
        
        // Handle specific status changes
        if (order.status === "Driver ditemukan") {
            assignDriver();
        } else if (order.status === "Pesanan selesai") {
            clearInterval(interval);
            setTimeout(() => {
                completeOrder();
            }, 3000);
        }
        
    }, 5000); // Update status every 5 seconds
}

// Assign random driver
function assignDriver() {
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    
    // Update driver info
    driverName.textContent = randomDriver.name;
    vehicleInfo.textContent = `${randomDriver.vehicle} • ${randomDriver.plate}`;
    document.querySelector('.driver-photo img').src = randomDriver.photo;
    
    // Show driver info
    driverInfo.style.display = 'flex';
    
    // Add call button functionality
    const callButton = document.createElement('button');
    callButton.className = 'btn-call';
    callButton.innerHTML = '<i class="fas fa-phone"></i> Hubungi Driver';
    callButton.addEventListener('click', function() {
        alert(`Menghubungi driver: ${randomDriver.name}\nNomor: ${randomDriver.phone}`);
    });
    
    // Remove existing call button if any
    const existingCallButton = document.querySelector('.btn-call');
    if (existingCallButton) {
        existingCallButton.remove();
    }
    
    driverInfo.appendChild(callButton);
}

// Complete order
function completeOrder() {
    // Save to order history
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    
    order.completedAt = new Date().toLocaleString();
    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Show completion message
    const completionMessage = document.createElement('div');
    completionMessage.className = 'completion-message';
    completionMessage.innerHTML = `
        <h3>Pesanan Selesai</h3>
        <p>Terima kasih telah menggunakan Gojek</p>
        <button id="rateOrder" class="btn-rate">Beri Penilaian</button>
        <button id="newOrder" class="btn-new-order">Pesan Lagi</button>
    `;
    
    // Replace order status with completion message
    const statusCard = document.querySelector('.status-card');
    statusCard.innerHTML = '';
    statusCard.appendChild(completionMessage);
    
    // Add event listeners for new buttons
    document.getElementById('rateOrder').addEventListener('click', function() {
        rateOrder(order);
    });
    
    document.getElementById('newOrder').addEventListener('click', function() {
        localStorage.removeItem('currentOrder');
        window.location.href = 'index.html';
    });
}

// Rate order
function rateOrder(order) {
    const ratingForm = document.createElement('div');
    ratingForm.className = 'rating-form';
    ratingForm.innerHTML = `
        <h3>Beri Penilaian</h3>
        <div class="stars">
            <i class="far fa-star" data-rating="1"></i>
            <i class="far fa-star" data-rating="2"></i>
            <i class="far fa-star" data-rating="3"></i>
            <i class="far fa-star" data-rating="4"></i>
            <i class="far fa-star" data-rating="5"></i>
        </div>
        <textarea placeholder="Tulis ulasan Anda (opsional)"></textarea>
        <button id="submitRating" class="btn-submit">Kirim Penilaian</button>
    `;
    
    const completionMessage = document.querySelector('.completion-message');
    completionMessage.innerHTML = '';
    completionMessage.appendChild(ratingForm);
    
    // Star rating functionality
    const stars = document.querySelectorAll('.stars .fa-star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
    
    // Submit rating
    document.getElementById('submitRating').addEventListener('click', function() {
        if (selectedRating === 0) {
            alert('Silakan beri rating terlebih dahulu');
            return;
        }
        
        const reviewText = document.querySelector('.rating-form textarea').value;
        
        // Save rating (in a real app, this would be sent to the server)
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        const updatedOrder = orderHistory.find(o => o.completedAt === order.completedAt);
        
        if (updatedOrder) {
            updatedOrder.rating = selectedRating;
            updatedOrder.review = reviewText;
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        }
        
        alert('Terima kasih atas penilaian Anda!');
        localStorage.removeItem('currentOrder');
        window.location.href = 'index.html';
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadOrderData();
    
    // Add back button functionality
    document.querySelector('.back-button a').addEventListener('click', function(e) {
        e.preventDefault();
        const confirmLeave = confirm('Batalkan pesanan saat ini?');
        if (confirmLeave) {
            localStorage.removeItem('currentOrder');
            window.location.href = 'index.html';
        }
    });
});


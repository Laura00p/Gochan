

// Simpan data pengguna (untuk simulasi)
const users = [
    { phone: "+6281234567890", password: "password123", name: "John Doe" }
];

// Elemen DOM
const loginForm = document.getElementById('loginForm');
const otpForm = document.getElementById('otpForm');
const otpContainer = document.getElementById('otpContainer');
const phoneNumberDisplay = document.getElementById('phoneNumberDisplay');
const resendOtp = document.getElementById('resendOtp');
const countdown = document.getElementById('countdown');
const signupLink = document.getElementById('signupLink');

// Variabel global
let currentPhone = '';
let otp = '';
let timer;

// Handle login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value;
    currentPhone = countryCode + phone;
    
    // Validasi nomor telepon
    if (!phone || phone.length < 10) {
        alert('Nomor telepon tidak valid');
        return;
    }
    
    // Generate OTP (untuk demo, OTP selalu 1234)
    otp = '1234';
    alert(`OTP untuk nomor ${currentPhone} adalah: ${otp}`);
    
    // Tampilkan OTP container
    phoneNumberDisplay.textContent = currentPhone;
    loginForm.parentElement.style.display = 'none';
    otpContainer.style.display = 'block';
    
    // Mulai countdown
    startCountdown();
});

// Handle OTP form submission
otpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    let enteredOtp = '';
    
    otpInputs.forEach(input => {
        enteredOtp += input.value;
    });
    
    // Validasi OTP
    if (enteredOtp === otp) {
        // Simpan data login di localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('phone', currentPhone);
        
        // Redirect ke halaman utama
        window.location.href = 'index.html';
    } else {
        alert('Kode OTP salah, silakan coba lagi');
    }
});

// Handle resend OTP
resendOtp.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Generate OTP baru (untuk demo tetap 1234)
    otp = '1234';
    alert(`OTP baru untuk nomor ${currentPhone} adalah: ${otp}`);
    
    // Reset input OTP
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.value = '';
    });
    
    // Fokus ke input pertama
    otpInputs[0].focus();
    
    // Reset countdown
    clearInterval(timer);
    startCountdown();
});

// Handle signup link
signupLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Fitur pendaftaran akan segera tersedia');
});

// Auto move between OTP inputs
document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
    input.addEventListener('input', function() {
        if (this.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

// Countdown function
function startCountdown() {
    let timeLeft = 60;
    countdown.textContent = `(${timeLeft})`;
    
    timer = setInterval(() => {
        timeLeft--;
        countdown.textContent = `(${timeLeft})`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            countdown.textContent = '';
        }
    }, 1000);
}

// Check if user is already logged in
function checkLogin() {
    if (localStorage.getItem('isLoggedIn') === 'true' && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    } else if (localStorage.getItem('isLoggedIn') !== 'true' && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Panggil fungsi checkLogin saat halaman dimuat
window.addEventListener('DOMContentLoaded', checkLogin);
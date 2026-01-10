//fungsi unutk tombol menu tampilan mobile
const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

//fungsi buat geser carousel
const carousel = document.getElementById('carousel-Photo');
const slides = carousel.children;
const btnKanan = document.getElementById('btnKanan');
const btnKiri = document.getElementById('btnKiri');

let index = 0;
const totalSlides = slides.length;
let autoSlides;

function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    index = (index + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function startAutoSlide() {
    autoSlides = setInterval(nextSlide, 2000);
}
function resetAutoSlide() {
    clearInterval(autoSlides);
    startAutoSlide();
}

btnKanan.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

btnKiri.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
})

startAutoSlide();


class PhotoSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoPlayBtn = document.getElementById('autoPlayBtn');
        this.speedSelect = document.getElementById('speedSelect');
        
        this.currentSlide = 0;
        this.isPlaying = true;
        this.interval = null;
        this.speed = 2000;
        
        this.init();
    }
    
    init() {
        this.startAutoPlay();
        this.addEventListeners();
        this.updateControls();
    }
    
    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
        this.speedSelect.addEventListener('change', (e) => this.changeSpeed(e.target.value));
        
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    updateSlider() {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    startAutoPlay() {
        this.interval = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, this.speed);
    }
    
    toggleAutoPlay() {
        this.isPlaying = !this.isPlaying;
        this.updateControls();
        
        if (this.isPlaying && !this.interval) {
            this.startAutoPlay();
        } else if (!this.isPlaying && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    changeSpeed(newSpeed) {
        this.speed = parseInt(newSpeed);
        
        if (this.isPlaying) {
            clearInterval(this.interval);
            this.startAutoPlay();
        }
    }
    
    updateControls() {
        this.autoPlayBtn.textContent = this.isPlaying ? '⏸️ Пауза' : '▶️ Воспроизвести';
        this.speedSelect.value = this.speed;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new PhotoSlider();
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
});
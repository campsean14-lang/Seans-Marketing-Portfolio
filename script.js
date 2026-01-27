// Smooth scroll behavior (already handled by CSS, but adding fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dropdown toggle for social media posts
document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdownImages = this.closest('.dropdown-item').querySelector('.dropdown-images');
        if (dropdownImages.style.display === 'none') {
            dropdownImages.style.display = 'grid';
            this.textContent = 'Hide Images';
        } else {
            dropdownImages.style.display = 'none';
            this.textContent = 'View More';
        }
    });
});

// Modal for image zoom
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');

document.querySelectorAll('.modal-trigger').forEach(img => {
    img.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
        modalImg.src = this.src;
    });
});

closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Here you would typically send the form data to a server
        // For now, we'll just show an alert
        alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
        
        // Reset form
        this.reset();
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all portfolio items and resume items
document.querySelectorAll('.portfolio-item, .resume-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});
